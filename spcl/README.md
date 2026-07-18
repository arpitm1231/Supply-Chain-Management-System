# SupplyLink — Supply Chain Management System

A full-stack MERN application for managing inventory, orders, and live shipment
tracking, with role-based auth and real-time updates over Socket.IO.

## Stack

- **Backend**: Node.js, Express 5, MongoDB (Mongoose), JWT auth, Socket.IO, express-validator, helmet, rate limiting
- **Frontend**: React 19, Vite, React Router, Recharts, React-Leaflet (OpenStreetMap), Socket.IO client

## Features

- **Auth**: register/login with JWT, bcrypt-hashed passwords, role-based access (`admin`, `inventory`, `order`)
- **Inventory**: CRUD, low-stock alerts, restocking
- **Orders**: CRUD, status lifecycle (`pending → shipped → delivered`, or `cancelled`), server-side route validation
- **Live Tracking**: a backend simulator advances every "shipped" order's position along its route and
  pushes updates over Socket.IO; the frontend interpolates marker movement for smooth animation, with
  a live ETA countdown and a status timeline per shipment
- **Dashboard**: real metrics computed from the database (no hardcoded numbers) — inventory totals, low
  stock, orders in transit, delayed/critically-delayed orders (based on actual ETA), and average delivery time

## Project structure

```
server/                  Express API
  config/                DB connection, static city coordinates
  controllers/            Route handlers
  middleware/             auth (JWT), validate (express-validator), errorHandler
  models/                 Mongoose schemas (User, Order, Inventory)
  routes/                 Express routers
  services/               Live tracking simulator
  validators/              express-validator chains
  seed.js                 Demo data seeder

supply-chain-frontend/    React app
  src/api/axios.js        Configured axios instance (auth header, 401 handling)
  src/context/            AuthContext
  src/lib/socket.js       Shared Socket.IO client
  src/components/         Sidebar, Topbar, AppLayout, Charts, StatusTimeline
  src/pages/               Dashboard, Orders, Inventory, Tracking, Login, Register, HomePage
```

## Getting started

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # then fill in your own MongoDB URI and JWT secret
npm run seed            # optional: populate demo users/inventory/orders
npm run dev
```

The API runs on `http://localhost:5000` by default.

**Demo logins after seeding:**
| Role | Email | Password |
|---|---|---|
| Admin | admin@supplylink.com | admin123 |
| Inventory Manager | inventory@supplylink.com | inventory123 |
| Order Manager | orders@supplylink.com | orders123 |

### 2. Frontend

```bash
cd supply-chain-frontend
npm install
cp .env.example .env   # defaults already point at localhost:5000
npm run dev
```

Visit `http://localhost:5173`.

## Security notes

- **Rotate your MongoDB Atlas credentials and JWT secret before deploying** — never commit real
  `.env` values to source control. `.gitignore` files are included for both `server/` and the frontend.
  Generate a strong JWT secret with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- All write endpoints require a valid JWT and are role-restricted (`authorize()` middleware).
- Requests are rate-limited and validated (`express-validator`) before hitting controllers.
- `helmet()` sets sensible security headers; CORS is restricted to `CLIENT_URL`.

## Notes on the live tracking simulation

Since this project doesn't integrate a real GPS/carrier API, `services/trackingSimulator.js` advances
each "shipped" order's progress on a timer and emits `tracking:update` events over Socket.IO. Positions
are computed by linearly interpolating between the resolved lat/lng of the order's origin and destination
cities (`config/cities.js`). This is swappable later for a real tracking provider without touching the
frontend contract (`{ id, status, progress, currentLocation, eta, deliveredAt }`).
