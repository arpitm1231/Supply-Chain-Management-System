const Order = require("../models/Order");
const { resolveRoute } = require("../config/cities");

const TICK_MS = 4000; // how often we advance active shipments
const PROGRESS_PER_TICK = 3; // % progress gained per tick (~2-3 min to deliver, good for a demo)

// Advances every "shipped" order a little closer to its destination and
// broadcasts the update over Socket.IO so connected clients see live
// movement without polling. Marks an order "delivered" once it reaches 100%.
function startTrackingSimulator(io) {
  const tick = async () => {
    try {
      const activeOrders = await Order.find({ status: "shipped" });

      for (const order of activeOrders) {
        const resolved = resolveRoute(order.route);
        if (!resolved) continue; // can't simulate a route we can't geocode

        const jitter = Math.random() * 2; // slight variance so shipments don't move in lockstep
        const nextProgress = Math.min(100, (order.progress || 0) + PROGRESS_PER_TICK + jitter);

        order.progress = nextProgress;

        if (nextProgress >= 100) {
          order.status = "delivered"; // triggers pre-save hook: sets deliveredAt, pushes history
        }

        await order.save();

        const t = order.status === "delivered" ? 1 : order.progress / 100;
        const currentLocation = {
          lat: resolved.origin.lat + (resolved.destination.lat - resolved.origin.lat) * t,
          lng: resolved.origin.lng + (resolved.destination.lng - resolved.origin.lng) * t,
        };

        io.emit("tracking:update", {
          id: order._id,
          status: order.status,
          progress: order.progress,
          currentLocation,
          eta: order.eta,
          deliveredAt: order.deliveredAt,
        });
      }
    } catch (err) {
      console.error("Tracking simulator tick failed:", err.message);
    }
  };

  const interval = setInterval(tick, TICK_MS);
  console.log(`🛰️  Live tracking simulator running (every ${TICK_MS / 1000}s)`);
  return () => clearInterval(interval);
}

module.exports = startTrackingSimulator;
