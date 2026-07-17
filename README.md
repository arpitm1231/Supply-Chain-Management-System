<div align="center">

# 🚚 SupplyLink

**A real-time supply chain platform — inventory, orders, and live shipment tracking in one dashboard.**




## Overview

SupplyLink gives a team a single, live view of stock levels, order status, and shipments moving across the country — updated the moment something changes. It's built as a full-stack MERN app with role-based access, a live tracking simulator, and a real-time dashboard powered by Socket.IO.

## ✨ Features

- 📊 **Live dashboard** — inventory levels, order breakdown by status, low-stock alerts, and average delivery time at a glance
- 📦 **Inventory management** — add, update, and track stock with automatic low-stock detection
- 🧾 **Order management** — create orders, transition status (`pending → shipped → delivered / cancelled`), and view a full status-change history per order
- 🛰️ **Live shipment tracking** — a simulated fleet moves along real origin → destination routes, broadcasting position updates every few seconds over WebSockets
- 🔐 **Role-based access control** — `admin`, `order`, and `inventory` roles each see only what's relevant to them, enforced on both the API and the UI
- ⚡ **Real-time updates** — order and tracking changes push to connected clients instantly via Socket.IO, no polling required
- 🛡️ **Hardened API** — JWT auth, bcrypt password hashing, request validation, rate limiting, and Helmet security headers out of the box

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router 7, Vite, Recharts, Leaflet / React-Leaflet, Socket.IO Client |
| **Backend** | Node.js, Express 5, Mongoose (MongoDB Atlas) |
| **Real-time** | Socket.IO |
| **Auth & Security** | JWT, bcryptjs, Helmet, express-rate-limit, express-validator |
| **Logging** | Morgan |

## 📁 Project Structure

```
spcl/
├── server/                     # Express API
│   ├── config/                 # DB connection, city/route data
│   ├── controllers/            # Route handlers (auth, orders, inventory, dashboard)
│   ├── middleware/              # Auth guard, role guard, error handling, validation
│   ├── models/                  # Mongoose schemas (User, Order, Inventory)
│   ├── routes/                  # API route definitions
│   ├── services/                # Live tracking simulator
│   ├── validators/              # express-validator request schemas
│   ├── seed.js                  # Sample data seeder
│   └── index.js                 # App entry point
│
└── supply-chain-frontend/       # React (Vite) client
    └── src/
        ├── api/                  # Axios instance
        ├── components/           # Sidebar, Topbar, Charts, ProtectedRoute, etc.
        ├── context/              # Auth context/provider
        ├── lib/                  # Socket.IO client setup
        └── pages/                # Dashboard, Orders, Inventory, Tracking, Auth
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)

### 1. Clone & install

```bash
git clone <your-repo-url>
cd spcl

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../supply-chain-frontend && npm install
```

### 2. Configure environment variables

Create a `.env` file inside `server/`:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas connection URI
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/supplylink?retryWrites=true&w=majority

# JWT
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=7d
```

### 3. (Optional) Seed sample data

```bash
cd server
npm run seed
```

### 4. Run the app

In one terminal, start the API:

```bash
cd server
npm run dev
```

In another, start the frontend:

```bash
cd supply-chain-frontend
npm run dev
```

- API: `http://localhost:5000`
- App: `http://localhost:5173`

## 🔑 Roles & Permissions

| Role | Dashboard | Orders | Inventory | Tracking |
|---|:---:|:---:|:---:|:---:|
| **admin** | ✅ | ✅ full access | ✅ full access | ✅ |
| **order** | ✅ | ✅ full access | ❌ | ✅ |
| **inventory** | ✅ | ❌ | ✅ full access | ✅ |

Role checks are enforced both on the API (`protect` + `authorize` middleware) and in the React app (`ProtectedRoute` + role-aware sidebar), so a user can't reach data outside their role either by clicking around or by calling the API directly.

## 📡 API Overview

All routes are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Create a new account |
| `POST` | `/auth/login` | Public | Log in, receive a JWT |
| `GET` | `/auth/me` | Authenticated | Get the current user |
| `GET` | `/orders` | admin, order | List all orders |
| `POST` | `/orders` | admin, order | Create an order |
| `PUT` | `/orders/:id` | admin, order | Update order status |
| `DELETE` | `/orders/:id` | admin, order | Delete an order |
| `GET` | `/inventory` | admin, inventory | List all inventory items |
| `POST` | `/inventory` | admin, inventory | Add an inventory item |
| `PATCH` | `/inventory/:id` | admin, inventory | Update stock level |
| `DELETE` | `/inventory/:id` | admin, inventory | Delete an inventory item |
| `GET` | `/dashboard` | Authenticated | Aggregated metrics for the dashboard |
| `GET` | `/tracking` | Authenticated | Live position for all shipments |
| `GET` | `/tracking/:orderId` | Authenticated | Live position for a single shipment |

## 🛰️ Live Tracking Simulator

Once an order's status is `shipped`, a background service interpolates its position between origin and destination cities based on `progress` (0–100), advancing it automatically and broadcasting updates over Socket.IO every few seconds — no external GPS feed required, so the whole demo runs entirely offline against your own data.

## 🧪 Scripts Reference

**Server** (`server/package.json`)
| Script | Description |
|---|---|
| `npm start` | Run the API in production mode |
| `npm run dev` | Run the API with auto-restart on file changes |
| `npm run seed` | Populate the database with sample orders & inventory |

**Frontend** (`supply-chain-frontend/package.json`)
| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## 🗺️ Roadmap Ideas

- [ ] Email notifications on critical delivery delays
- [ ] Exportable inventory/order reports (CSV / PDF)
- [ ] Configurable low-stock threshold per product
- [ ] Multi-warehouse support

