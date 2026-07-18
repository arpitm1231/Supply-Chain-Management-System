const express = require("express");
const router = express.Router();
const {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createOrderValidator,
  updateOrderStatusValidator,
  idParamValidator,
} = require("../validators/orderValidators");

router.get("/", protect, authorize("admin", "order"), getOrders);
router.post("/", protect, authorize("admin", "order"), createOrderValidator, validate, createOrder);
router.put("/:id", protect, authorize("admin", "order"), updateOrderStatusValidator, validate, updateOrderStatus);
router.delete("/:id", protect, authorize("admin", "order"), idParamValidator, validate, deleteOrder);

module.exports = router;