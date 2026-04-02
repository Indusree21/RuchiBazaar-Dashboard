const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log("✅ Connected to MongoDB");
    
    const users = await User.find({});
    console.log("\n📋 All users in database:");
    console.log(JSON.stringify(users, null, 2));
    
    if (users.length === 0) {
      console.log("❌ NO USERS FOUND IN DATABASE!");
    } else {
      console.log(`\n✅ Found ${users.length} user(s)`);
      users.forEach(user => {
        console.log(`   - Phone: ${user.phone}, Name: ${user.name}, Role: ${user.role}`);
      });
    }
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

checkDatabase();
