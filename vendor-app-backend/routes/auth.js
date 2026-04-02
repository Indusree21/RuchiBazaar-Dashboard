const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose"); // ✅ Added for ObjectId conversion
const router = express.Router();

const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

// ===== Multer setup for product images =====
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

// ===== Signup =====
router.post("/signup", async (req, res) => {
  let { name, phone, password, role } = req.body;
  phone = phone.trim(); // Remove whitespace
  console.log(`📝 Signup attempt - Phone: "${phone}", Name: ${name}, Role: ${role}`);
  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      console.log(`❌ User already exists with phone: ${phone}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, phone, password: hashedPassword, role });
    await newUser.save();
    console.log(`✅ New user created: ${phone} (${name})`);

    res.status(201).json({
      message: "Signup successful",
      _id: newUser._id,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ error: "Failed to sign up" });
  }
});

// ===== Login =====
router.post("/login", async (req, res) => {
  let { phone, password } = req.body;
  phone = phone.trim(); // Remove whitespace
  if (!phone || !password) {
    return res.status(400).json({ message: "Phone and password are required" });
  }

  try {
    console.log(`🔍 Login attempt with phone: "${phone}"`);
    const user = await User.findOne({ phone });
    
    if (!user) {
      console.log(`❌ User not found with phone: "${phone}"`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`✅ User found: ${user.name} (${user.phone})`);
    console.log(`🔑 Comparing password...`);
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match result: ${isMatch}`);
    
    if (!isMatch) {
      console.log(`❌ Password mismatch for user: ${phone}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`✅ Login successful for ${phone}`);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      role: user.role
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

// ===== Forgot Password =====
router.post("/forgot-password", async (req, res) => {
  let { phone, newPassword } = req.body;
  phone = phone.trim(); // Remove whitespace
  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// ===== Vendor Dashboard =====
router.get("/vendor/:phone", async (req, res) => {
  try {
    const orders = await Order.find({ vendorPhone: req.params.phone });

    const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(order => order.status === "delivered").length;
    const pendingOrders = orders.filter(order => order.status === "pending").length;

    res.status(200).json({ totalOrders, deliveredOrders, pendingOrders, totalSpent });
  } catch (err) {
    console.error("❌ Vendor dashboard error:", err);
    res.status(500).json({ error: "Failed to fetch vendor data" });
  }
});

// ===== Supplier Dashboard =====
//const Product = require('../models/Product'); // add this at the top
router.get("/supplier/dashboard/:supplierId", async (req, res) => {
  try {
    const { supplierId } = req.params;

    // Fetch supplier info
    const supplier = await User.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    if (supplier.role !== "supplier") {
      return res.status(403).json({ message: "User is not a supplier" });
    }

    // ✅ Correct product count
    const productsListed = await Product.countDocuments({ supplierId: supplierId });

    // Fetch orders
    const ordersReceivedData = await Order.find({ supplierId });
    const ordersReceived = ordersReceivedData.length;
    const pendingOrders = ordersReceivedData.filter(order => order.status === "pending").length;
    const totalEarnings = ordersReceivedData.reduce((acc, order) => acc + order.totalAmount, 0);

    res.status(200).json({
      productsListed,
      ordersReceived,
      pendingOrders,
      totalEarnings,
    });
  } catch (error) {
    console.error("❌ Supplier dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch supplier data" });
  }
});

// ===== Onboarding =====
router.post("/onboarding", async (req, res) => {
  const {
    phone, name, vendorType, stallName,
    businessType, pickupSlot,
    address = {}
  } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.onboardingCompleted) {
      return res.status(400).json({ message: "Profile already completed" });
    }

    user.name = name;
    user.address = address;
    user.onboardingCompleted = true;

    if (user.role === "vendor") {
      user.vendorType = vendorType;
      user.stallName = stallName;
    } else if (user.role === "supplier") {
      user.businessType = businessType;
      user.pickupSlot = pickupSlot;
    }

    await user.save();
    res.status(200).json({ message: "Profile completed successfully" });
  } catch (error) {
    console.error("❌ Onboarding error:", error);
    res.status(500).json({ error: "Failed to complete profile" });
  }
});

// ===== Add Product with image upload =====
router.post("/products/add", upload.single("image"), async (req, res) => {
  try {
    const { supplierId, name, price, description, category, quantity, quantityType } = req.body;

    if (!supplierId) {
      return res.status(400).json({ message: "Supplier ID missing. Please log in again." });
    }

    const supplier = await User.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    if (supplier.role !== "supplier") {
      return res.status(403).json({ message: "User is not a supplier" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    // ✅ FIX: store supplierId as ObjectId
    const newProduct = new Product({
      supplierId: new mongoose.Types.ObjectId(supplierId),
      name,
      price,
      description,
      category,
      quantity,
      quantityType,
      imageUrl: `/uploads/${req.file.filename}`
    });

    await newProduct.save();
    res.status(201).json({
      message: "✅ Product added successfully",
      product: newProduct
    });
  } catch (error) {
    console.error("❌ Add Product Error:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ===== Get products by supplierId =====
router.get("/products/supplier/:supplierId", async (req, res) => {
  try {
    const { supplierId } = req.params;
    const products = await Product.find({
      supplierId: new mongoose.Types.ObjectId(supplierId) // ✅ ensure match
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Get Products Error:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
});

// Get supplier profile
router.get("/supplier/:id", async (req, res) => {
  try {
    const supplier = await User.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update supplier profile
router.put("/supplier/:id", async (req, res) => {
  try {
    const {
      name,
      phone,
      role,
      businessName,
      businessType,
      materialCategory,
      experience,
      address,
    } = req.body;

    const updatedSupplier = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phone,
        role,
        businessName,
        businessType,
        materialCategory,
        experience,
        address,
      },
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(updatedSupplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===== Get all products (for vendor marketplace) =====
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate('supplierId', 'name phone businessName address');
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Get All Products Error:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
});

// ===== Place Order (Vendor buys from Supplier) =====
router.post("/orders/place", async (req, res) => {
  try {
    const { vendorId, productId, quantity } = req.body;

    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") {
      return res.status(403).json({ message: "Invalid vendor" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const totalAmount = product.price * quantity;

    const newOrder = new Order({
      vendorPhone: vendor.phone,
      supplierId: product.supplierId,
      productName: product.name,
      quantity,
      unit: product.quantityType,
      pricePerKg: product.price,
      totalAmount,
      status: "pending"
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Place Order Error:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// ===== Get Vendor Orders =====
router.get("/orders/vendor/:vendorId", async (req, res) => {
  try {
    const vendor = await User.findById(req.params.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const orders = await Order.find({ vendorPhone: vendor.phone })
      .populate('supplierId', 'name businessName phone')
      .sort({ orderDate: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Get Vendor Orders Error:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
});

// ===== Get Supplier Orders =====
router.get("/orders/supplier/:supplierId", async (req, res) => {
  try {
    const orders = await Order.find({ supplierId: req.params.supplierId })
      .sort({ orderDate: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Get Supplier Orders Error:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
});

// ===== Update Order Status =====
router.put("/orders/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("❌ Update Order Status Error:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// ===== Get Vendor Profile =====
router.get("/vendor/profile/:id", async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Update Vendor Profile =====
router.put("/vendor/profile/:id", async (req, res) => {
  try {
    const { name, phone, vendorType, stallName, address } = req.body;

    const updatedVendor = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, vendorType, stallName, address },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(updatedVendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export router AFTER all routes
module.exports = router;
