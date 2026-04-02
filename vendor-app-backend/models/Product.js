const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  category: { 
  type: String, 
  required: true,
  enum: ['Vegetables', 'Fruits', 'Grains', 'Spices', 'Dairy', 'Beverages']
},
  quantity: { type: Number, required: true },
  quantityType: {
  type: String,
  required: true,
  enum: ['kg', 'gram', 'litres']
},
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
