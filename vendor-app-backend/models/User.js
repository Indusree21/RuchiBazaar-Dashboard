const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["vendor", "supplier"], required: true },

  // Common fields
  address: {
    street: String,
    village: String,
    district: String,
    state: String,
    pincode: String
  },

  onboardingCompleted: { type: Boolean, default: false },

  // Vendor-specific fields
  vendorType: String,
  stallName: String,

  // Supplier-specific fields
  businessName: String,
  businessType: String,
  materialCategory: String,
  experience: String,
  pickupSlot: String
});

module.exports = mongoose.model("User", userSchema);
