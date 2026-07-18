const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: { type: String, required: true },  // Product name
    stock: { type: Number, required: true },    // Quantity in stock
    city: { type: String, required: true },     // City where the stock is located
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

module.exports = mongoose.model("Inventory", inventorySchema);
