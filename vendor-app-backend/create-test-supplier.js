const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createTestSupplier() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log("✅ Connected to MongoDB");
    
    // Delete existing test supplier if any
    await User.deleteOne({ phone: "8888888888" });
    
    // Create new test supplier
    const hashedPassword = await bcrypt.hash("test123", 10);
    const testSupplier = new User({
      name: "Test Supplier",
      phone: "8888888888",
      password: hashedPassword,
      role: "supplier"
    });
    
    await testSupplier.save();
    console.log("\n✅ Test supplier created successfully!");
    console.log("📱 Phone: 8888888888");
    console.log("🔐 Password: test123");
    console.log("👤 Role: supplier");
    console.log("\nTry logging in with these credentials as a supplier.");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

createTestSupplier();
