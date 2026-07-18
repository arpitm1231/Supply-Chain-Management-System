const express = require("express");
const router = express.Router();

const {
  getInventory,
  addInventoryItem,
  updateStock,
  deleteInventoryItem,
} = require("../controllers/inventoryController");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createInventoryValidator,
  updateStockValidator,
  idParamValidator,
} = require("../validators/inventoryValidators");

router.get("/", protect, authorize("admin", "inventory"), getInventory);
router.post("/", protect, authorize("admin", "inventory"), createInventoryValidator, validate, addInventoryItem);
router.patch("/:id", protect, authorize("admin", "inventory"), updateStockValidator, validate, updateStock);
router.delete("/:id", protect, authorize("admin", "inventory"), idParamValidator, validate, deleteInventoryItem);

module.exports = router;