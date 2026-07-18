const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");
const { resolveRoute } = require("../config/cities");
const { protect } = require("../middleware/auth");

// Projects an order's live position given its origin/destination and
// current progress (0-100), matching what the tracking simulator computes.
const buildTrackingPayload = (order) => {
  const resolved = resolveRoute(order.route);
  if (!resolved) return null;

  const { origin, destination, originCity, destinationCity } = resolved;
  const t = order.status === "delivered" ? 1 : (order.progress || 0) / 100;

  const currentLocation = {
    lat: origin.lat + (destination.lat - origin.lat) * t,
    lng: origin.lng + (destination.lng - origin.lng) * t,
  };

  return {
    id: order._id,
    product: order.product,
    quantity: order.quantity,
    status: order.status,
    priority: order.priority,
    route: order.route,
    originCity,
    destinationCity,
    origin,
    destination,
    currentLocation,
    progress: order.progress || 0,
    eta: order.eta,
    deliveredAt: order.deliveredAt,
    statusHistory: order.statusHistory,
    createdAt: order.createdAt,
  };
};

// GET /api/tracking - all orders with tracking info
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    const trackingData = orders.map(buildTrackingPayload).filter(Boolean);
    res.json(trackingData);
  })
);

// GET /api/tracking/:orderId
router.get(
  "/:orderId",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const payload = buildTrackingPayload(order);
    if (!payload) return res.status(400).json({ error: "Invalid route in order" });

    res.json(payload);
  })
);

module.exports = router;
