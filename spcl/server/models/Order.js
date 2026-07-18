const mongoose = require("mongoose");

const STATUSES = ["pending", "shipped", "delivered", "cancelled"];

const orderSchema = new mongoose.Schema(
  {
    product: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: STATUSES,
      default: "pending",
    },
    route: { type: String, required: true, trim: true }, // e.g. "Delhi to Mumbai"
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },
    // 0-100, driven by the live tracking simulator once status is "shipped"
    progress: { type: Number, default: 0, min: 0, max: 100 },
    // Estimated arrival, set automatically when an order ships
    eta: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    // Audit trail of status transitions, powers the tracking timeline UI
    statusHistory: [
      {
        status: { type: String, enum: STATUSES },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (this.isNew) {
    this.statusHistory = [{ status: this.status, at: new Date() }];
  } else if (this.isModified("status")) {
    this.statusHistory.push({ status: this.status, at: new Date() });
    if (this.status === "delivered") {
      this.progress = 100;
      this.deliveredAt = new Date();
    }
  }
  next();
});

orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
