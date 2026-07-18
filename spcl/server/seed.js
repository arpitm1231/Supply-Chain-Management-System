// Seeds the database with demo users, inventory, and orders.
// Run with: npm run seed
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const mongoose = require("mongoose");
const User = require("./models/User");
const Inventory = require("./models/Inventory");
const Order = require("./models/Order");

const demoUsers = [
  { name: "Admin User", email: "admin@supplylink.com", password: "admin123", role: "admin" },
  { name: "Inventory Manager", email: "inventory@supplylink.com", password: "inventory123", role: "inventory" },
  { name: "Order Manager", email: "orders@supplylink.com", password: "orders123", role: "order" },
];

const demoInventory = [
  { product: "Steel Rods", stock: 450, city: "Mumbai" },
  { product: "Copper Wire", stock: 80, city: "Pune" },
  { product: "Circuit Boards", stock: 320, city: "Bengaluru" },
  { product: "Packaging Boxes", stock: 60, city: "Delhi" },
  { product: "LED Panels", stock: 200, city: "Chennai" },
  { product: "Aluminium Sheets", stock: 40, city: "Hyderabad" },
];

const demoOrders = [
  { product: "Steel Rods", quantity: 100, status: "pending", route: "Mumbai to Delhi", priority: "normal" },
  { product: "Copper Wire", quantity: 50, status: "shipped", route: "Pune to Bengaluru", priority: "high" },
  { product: "Circuit Boards", quantity: 200, status: "shipped", route: "Bengaluru to Chennai", priority: "normal" },
  { product: "LED Panels", quantity: 75, status: "delivered", route: "Chennai to Hyderabad", priority: "low" },
  { product: "Packaging Boxes", quantity: 500, status: "cancelled", route: "Delhi to Jaipur", priority: "low" },
];

const seed = async () => {
  await connectDB();
  console.log("🌱 Seeding database...");

  await Promise.all([User.deleteMany(), Inventory.deleteMany(), Order.deleteMany()]);

  for (const u of demoUsers) {
    await User.create(u); // create() (not insertMany) so the password-hash pre-save hook runs
  }
  await Inventory.insertMany(demoInventory);

  for (const o of demoOrders) {
    const order = new Order(o);
    if (o.status === "shipped") {
      order.progress = Math.floor(Math.random() * 40);
      order.eta = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
    if (o.status === "delivered") {
      order.progress = 100;
      order.deliveredAt = new Date();
      order.eta = new Date(Date.now() - 2 * 60 * 60 * 1000);
    }
    await order.save();
  }

  console.log("✅ Seed complete. Demo logins:");
  demoUsers.forEach((u) => console.log(`   ${u.role.padEnd(10)} ${u.email} / ${u.password}`));

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
