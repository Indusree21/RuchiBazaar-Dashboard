const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log("✅ Connected to MongoDB");
    
    // Delete existing test user if any
    await User.deleteOne({ phone: "9999999999" });
    
    // Create new test user
    const hashedPassword = await bcrypt.hash("test123", 10);
    const testUser = new User({
      name: "Test User",
      phone: "9999999999",
      password: hashedPassword,
      role: "vendor"
    });
    
    await testUser.save();
    console.log("\n✅ Test user created successfully!");
    console.log("📱 Phone: 9999999999");
    console.log("🔐 Password: test123");
    console.log("\nTry logging in with these credentials.");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

createTestUser();
