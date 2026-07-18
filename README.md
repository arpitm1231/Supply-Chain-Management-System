<div align="center">

# 📦 SupplyLink

**A full-stack supply chain management platform with live shipment tracking**

Real-time inventory, orders, and GPS-style tracking — built on the MERN stack with Socket.IO.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-realtime-010101?logo=socket.io&logoColor=white)](https://socket.io)
[![License](https://img.shields.io/badge/license-ISC-blue)](#license)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API](#-api-reference) • [Project Structure](#-project-structure)

</div>

---

## ✨ Overview

SupplyLink is a role-based supply chain dashboard for managing **inventory**, **orders**, and **shipments** end to end. It ships with a live tracking simulator that moves shipments along real routes and streams position updates over WebSockets, so the map updates in real time without polling — no third-party GPS integration required to demo.

## 🚀 Features

| | |
|---|---|
| 🔐 **Role-based auth** | JWT-based login/register with bcrypt password hashing and three roles — `admin`, `inventory`, `order` |
| 📊 **Live dashboard** | Real metrics computed straight from the database — inventory totals, low stock, in-transit orders, delayed shipments, average delivery time |
| 📦 **Inventory management** | Full CRUD with low-stock alerts and restocking |
| 🧾 **Order management** | Full CRUD with a `pending → shipped → delivered` lifecycle (or `cancelled`), with server-side route validation |
| 🗺️ **Live shipment tracking** | A backend simulator advances every shipped order along its route and pushes updates via Socket.IO; the frontend smoothly interpolates marker movement on a Leaflet map, with live ETA countdowns and a per-shipment status timeline |
| 🛡️ **Hardened API** | `helmet`, rate limiting, and `express-validator` on every write endpoint |

## 🧱 Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB with Mongoose
- Socket.IO for real-time updates
- JWT auth · bcrypt · helmet · express-rate-limit · express-validator

**Frontend**
- React 19 + Vite
- React Router
- React-Leaflet (OpenStreetMap tiles) for live tracking
- Recharts / Chart.js for dashboard visualizations
- Socket.IO client

## 📁 Project Structure

```
spcl/
├── server/                      Express API
│   ├── config/                  DB connection, static city coordinates
│   ├── controllers/             Route handlers
│   ├── middleware/               auth (JWT), validate, errorHandler
│   ├── models/                   Mongoose schemas — User, Order, Inventory
│   ├── routes/                   Express routers
│   ├── services/                 trackingSimulator.js — live tracking engine
│   ├── validators/               express-validator chains
│   └── seed.js                   Demo data seeder
│
└── supply-chain-frontend/        React app
    ├── src/api/axios.js          Configured axios instance (auth header, 401 handling)
    ├── src/context/               AuthContext
    ├── src/lib/socket.js          Shared Socket.IO client
    ├── src/components/            Sidebar, Topbar, AppLayout, Charts, StatusTimeline
    └── src/pages/                 Dashboard, Orders, Inventory, Tracking, Login, Register, HomePage
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB connection string (e.g. from [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone and set up the backend

```bash
git clone https://github.com/<your-username>/supplylink.git
cd supplylink/server
npm install
cp .env.example .env
```

Fill in `.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/supplylink?retryWrites=true&w=majority

JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=7d
```

> Generate a strong JWT secret with:
> `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

```bash
npm run seed   # optional — populates demo users, inventory, and orders
npm run dev
```

The API runs at `http://localhost:5000`.

**Demo logins after seeding:**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@supplylink.com` | `admin123` |
| Inventory Manager | `inventory@supplylink.com` | `inventory123` |
| Order Manager | `orders@supplylink.com` | `orders123` |

### 2. Set up the frontend

```bash
cd ../supply-chain-frontend
npm install
cp .env.example .env   # defaults already point at localhost:5000
npm run dev
```

Visit `http://localhost:5173` 🎉

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

<details>
<summary><strong>Auth</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Log in and receive a JWT |
| `GET` | `/auth/me` | Get the current authenticated user |

</details>

<details>
<summary><strong>Inventory</strong></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/inventory` | Authenticated | List inventory items |
| `POST` | `/inventory` | `admin`, `inventory` | Add an inventory item |
| `PATCH` | `/inventory/:id` | `admin`, `inventory` | Update stock |
| `DELETE` | `/inventory/:id` | `admin`, `inventory` | Delete an item |

</details>

<details>
<summary><strong>Orders</strong></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/orders` | Authenticated | List orders |
| `POST` | `/orders` | `admin`, `order` | Create an order |
| `PUT` | `/orders/:id` | `admin`, `order` | Update order status |
| `DELETE` | `/orders/:id` | `admin`, `order` | Delete an order |

</details>

<details>
<summary><strong>Tracking & Dashboard</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tracking` | Live status/location of all shipped orders |
| `GET` | `/dashboard` | Aggregated metrics for the dashboard |

Real-time events (Socket.IO): `tracking:update`, `order:created`, `order:deleted`

</details>

## 🛰️ How live tracking works

Since this project doesn't integrate a real GPS/carrier API, `server/services/trackingSimulator.js` advances every `shipped` order's progress on a timer and emits `tracking:update` events over Socket.IO. Positions are computed by linearly interpolating between the resolved lat/lng of the order's origin and destination cities (`server/config/cities.js`). The frontend then smooths that motion between ticks for fluid marker animation.

This is designed to be swapped for a real tracking provider later without touching the frontend contract:

```json
{ "id", "status", "progress", "currentLocation", "eta", "deliveredAt" }
```

## 🔒 Security Notes

- **Rotate your MongoDB Atlas credentials and JWT secret before deploying** — never commit real `.env` values. `.gitignore` is already configured for both `server/` and the frontend.
- Every write endpoint requires a valid JWT and is role-restricted via `authorize()` middleware.
- Requests are rate-limited and validated with `express-validator` before hitting controllers.
- `helmet()` sets sensible security headers; CORS is restricted to `CLIENT_URL`.

## 🗺️ Roadmap Ideas

- [ ] Real carrier/GPS API integration
- [ ] Push notifications for delayed shipments
- [ ] Multi-warehouse inventory support
- [ ] Exportable reports (CSV/PDF)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a PR or file an issue.

## 📄 License

Licensed under the **ISC License**.

---

<div align="center">
Built with ❤️ using the MERN stack
</div>
