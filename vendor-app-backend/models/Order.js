const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  vendorPhone: { type: String, required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productName: { type: String },
  quantity: { type: Number },
  unit: { type: String }, // "kg", "g", etc.
  pricePerKg: { type: Number },
  totalAmount: { type: Number },
  status: { type: String, enum: ["pending", "delivered", "cancelled"], default: "pending" }, // Add status
  orderDate: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Order", orderSchema);
