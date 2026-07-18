const Inventory = require("../models/Inventory");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardData = asyncHandler(async (req, res) => {
  const totalInventory = await Inventory.countDocuments();
  const lowStock = await Inventory.countDocuments({ stock: { $lt: 100 } });

  const totalOrders = await Order.countDocuments();
  const ordersInTransit = await Order.countDocuments({ status: "shipped" });
  const cancelledOrders = await Order.countDocuments({ status: "cancelled" });
  const deliveredOrders = await Order.countDocuments({ status: "delivered" });

  // "Delayed" = still in transit but past its ETA
  const delayedOrders = await Order.countDocuments({
    status: "shipped",
    eta: { $lt: new Date() },
  });

  // Critically delayed = shipped, ETA missed by more than 24h
  const criticalDelayed = await Order.countDocuments({
    status: "shipped",
    eta: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  // Average time-to-delivery in minutes, from actual delivered orders
  const etaAgg = await Order.aggregate([
    { $match: { status: "delivered", deliveredAt: { $ne: null } } },
    {
      $project: {
        minutes: { $divide: [{ $subtract: ["$deliveredAt", "$createdAt"] }, 60000] },
      },
    },
    { $group: { _id: null, avgMinutes: { $avg: "$minutes" } } },
  ]);
  const averageETA = etaAgg.length ? Math.round(etaAgg[0].avgMinutes) : 0;

  const metrics = {
    totalInventory,
    lowStock,
    totalOrders,
    ordersInTransit,
    delayedOrders,
    cancelledOrders,
    deliveredOrders,
    averageETA,
    criticalDelayed,
  };

  const trends = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const inventoryData = await Inventory.find();

  res.json({ metrics, trends, inventoryData });
});

module.exports = { getDashboardData };
