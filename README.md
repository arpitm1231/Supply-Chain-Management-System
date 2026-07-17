# 📦 Supply Chain Management System

A full-stack web application for managing and visualizing supply chain operations — inventory levels, order lifecycle, and shipment tracking — through a single dashboard. Built with a React (Vite) frontend and a Node.js/Express + MongoDB backend.

---

## Overview

This system gives operations teams a real-time view into three core parts of a supply chain:

- **Inventory** across multiple warehouse/city locations
- **Orders** moving through pending → shipped → delivered (or cancelled) states
- **Shipment tracking** on an interactive map, based on each order's origin/destination route

It's designed as a lightweight internal tool: a REST API backs a single-page React app with a collapsible sidebar, summary dashboard, and dedicated pages for inventory, orders, and tracking.

---

## Features

- **Dashboard** — at-a-glance metrics (total inventory, low-stock count, total orders, in-transit/delayed/delivered counts, average ETA) plus order-status trend charts, powered by Chart.js/Recharts.
- **Inventory management** — list, add, restock (partial update), and remove inventory items, each tied to a product, stock count, and city.
- **Order management** — create orders with a product, quantity, and route (e.g. `"Delhi to Mumbai"`), update status, and delete orders.
- **Shipment tracking** — resolves an order's route into origin/destination coordinates and plots them on an interactive Leaflet map.
- **Responsive sidebar navigation** between Dashboard, Orders, Inventory, and Tracking views.

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router for client-side routing
- Chart.js / react-chartjs-2 / Recharts for data visualization
- Leaflet / react-leaflet for map-based shipment tracking
- Axios for API requests
- React Icons

**Backend**
- Node.js + Express 5
- MongoDB with Mongoose ODM
- JWT (`jsonwebtoken`) and `bcryptjs` for authentication primitives (user model and password hashing are in place)
- Socket.IO (installed, available for future real-time features)
- CORS + dotenv for configuration

---

## Project Structure

```
s-p-c-l/
├── server/                      # Express API
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── dashboardController.js
│   │   ├── inventoryController.js
│   │   └── orderController.js
│   ├── models/
│   │   ├── Inventory.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── dashboard.js
│   │   ├── inventory.js
│   │   ├── orders.js
│   │   ├── shipments.js
│   │   └── tracking.js
│   ├── data/                    # Seed / mock JSON data
│   ├── .env                     # Environment variables (not committed)
│   └── index.js                 # App entry point
│
└── supply-chain-frontend/       # React (Vite) client
    └── src/
        ├── api/
        │   └── axios.js         # Configured Axios instance
        ├── components/
        │   ├── Charts.jsx
        │   ├── MapComponent.jsx
        │   ├── Sidebar.jsx
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Orders.jsx
        │   ├── Inventory.jsx
        │   ├── Tracking.jsx
        │   └── HomePage.jsx
        └── App.jsx
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or MongoDB Atlas)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd s-p-c-l

# Backend
cd server
npm install

# Frontend
cd ../supply-chain-frontend
npm install
```

### 2. Configure environment variables

Create a `.env` file inside `server/` with:

```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

### 3. Run the app

```bash
# Terminal 1 — start the API (from /server)
npm start   # or: node index.js

# Terminal 2 — start the frontend (from /supply-chain-frontend)
npm run dev
```

The API runs on `http://localhost:5000` and the frontend dev server on the port Vite assigns (typically `http://localhost:5173`).

---

## API Reference

| Method | Endpoint                  | Description                          |
|--------|----------------------------|---------------------------------------|
| GET    | `/api/inventory`          | List all inventory items              |
| POST   | `/api/inventory`          | Add a new inventory item              |
| PATCH  | `/api/inventory/:id`      | Update stock for an item              |
| DELETE | `/api/inventory/:id`      | Delete an inventory item              |
| GET    | `/api/orders`             | List all orders                       |
| POST   | `/api/orders`             | Create a new order                    |
| PUT    | `/api/orders/:id`         | Update an order's status              |
| DELETE | `/api/orders/:id`         | Delete an order                       |
| GET    | `/api/dashboard/dashboard`| Aggregated metrics + trend data       |
| GET    | `/api/tracking`           | Tracking info for all orders          |
| GET    | `/api/tracking/:orderId`  | Tracking info for a single order      |

---



