const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");
const { resolveRoute } = require("../config/cities");

// GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { product, quantity, status, route, priority } = req.body;

  if (!resolveRoute(route)) {
    return res.status(400).json({
      message: `Route "${route}" could not be resolved. Use the form "Origin City to Destination City" with a supported city.`,
    });
  }

  // Randomized but plausible ETA window (12-72h out) so the tracking
  // simulator and dashboard have something meaningful to show.
  const etaHours = 12 + Math.floor(Math.random() * 60);
  const eta = new Date(Date.now() + etaHours * 60 * 60 * 1000);

  const newOrder = await Order.create({
    product,
    quantity,
    status: status || "pending",
    route,
    priority,
    eta,
  });

  req.app.get("io")?.emit("order:created", newOrder);
  res.status(201).json({ message: "Order created", order: newOrder });
});

// PUT /api/orders/:id
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  if (status === "shipped" && !order.eta) {
    order.eta = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  await order.save();

  req.app.get("io")?.emit("order:updated", order);
  res.json({ message: "Status updated", order });
});

// DELETE /api/orders/:id
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await Order.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "Order not found" });

  req.app.get("io")?.emit("order:deleted", { id });
  res.json({ message: "Order deleted" });
});

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
