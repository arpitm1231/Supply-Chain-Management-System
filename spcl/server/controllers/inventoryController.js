const Inventory = require("../models/Inventory");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/inventory
const getInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find().sort({ createdAt: -1 });
  res.json(inventory);
});

// POST /api/inventory
const addInventoryItem = asyncHandler(async (req, res) => {
  const { product, stock, city } = req.body;
  const newItem = await Inventory.create({ product, stock, city });
  req.app.get("io")?.emit("inventory:created", newItem);
  res.status(201).json(newItem);
});

// PATCH /api/inventory/:id
const updateStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  const item = await Inventory.findById(id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.stock = stock;
  await item.save();

  req.app.get("io")?.emit("inventory:updated", item);
  res.json(item);
});

// DELETE /api/inventory/:id
const deleteInventoryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await Inventory.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "Item not found" });

  req.app.get("io")?.emit("inventory:deleted", { id });
  res.json({ message: "Item deleted" });
});

module.exports = {
  getInventory,
  addInventoryItem,
  updateStock,
  deleteInventoryItem,
};
