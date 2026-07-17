# 🚚 SupplyLink – Smart Supply Chain Management System

SupplyLink is a modern full-stack Supply Chain Management platform designed to streamline inventory operations, order processing, shipment tracking, and logistics monitoring through a centralized dashboard.

The system combines real-time tracking, role-based access control, operational analytics, inventory management, and shipment lifecycle monitoring to provide end-to-end visibility across supply chain operations.

---

## ✨ Features

### 🔐 Authentication & Authorization

* Secure JWT-based authentication
* Password hashing using bcrypt
* Role-based access control
* Protected routes and APIs
* Session persistence

### 📦 Inventory Management

* Inventory tracking and monitoring
* Product stock management
* Low-stock alerts
* Inventory updates and restocking
* Warehouse inventory visibility

### 📋 Order Management

* Create and manage orders
* Update order status
* Order lifecycle management
* Route validation
* Order cancellation support

### 🚛 Real-Time Shipment Tracking

* Live shipment monitoring
* Dynamic ETA calculations
* Real-time location updates
* Socket.IO powered synchronization
* Shipment progress timeline

### 📊 Business Intelligence Dashboard

* Inventory analytics
* Order metrics
* Shipment statistics
* Delivery performance monitoring
* Operational insights and KPIs

### 🗺 Interactive Tracking Maps

* OpenStreetMap integration
* Live shipment visualization
* Route monitoring
* Location tracking
* Interactive delivery maps

### ⚡ Real-Time System Updates

* Socket.IO integration
* Live inventory updates
* Instant shipment status updates
* Dynamic dashboard refresh
* Real-time operational monitoring

### 🛡 Security & Reliability

* JWT authentication
* Express Validator
* Rate Limiting
* Helmet security middleware
* Centralized error handling
* Secure API architecture

---

# 🏗 System Architecture

```text
Frontend (React + Vite)
        │
        ▼
REST APIs + Socket.IO
        │
        ▼
Backend (Node.js + Express)
        │
        ▼
MongoDB Database
        │
        ▼
Live Tracking Simulator
```

---

# 🛠 Technology Stack

## Frontend

* React 19
* Vite
* React Router
* Axios
* Recharts
* Chart.js
* React Leaflet
* Socket.IO Client
* React Icons

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO
* Express Validator
* Helmet
* Rate Limiter
* bcrypt

## Database

* MongoDB Atlas
* Mongoose ODM

---

# 📂 Project Structure

```text
SupplyLink
│
├── server
│   │
│   ├── config
│   │   ├── db.js
│   │   └── cities.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── inventoryController.js
│   │   └── orderController.js
│   │
│   ├── middleware
│   │   ├── auth.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Inventory.js
│   │   └── Order.js
│   │
│   ├── routes
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── inventory.js
│   │   ├── orders.js
│   │   └── tracking.js
│   │
│   ├── services
│   │   └── trackingSimulator.js
│   │
│   ├── validators
│   │   ├── authValidators.js
│   │   ├── inventoryValidators.js
│   │   └── orderValidators.js
│   │
│   ├── utils
│   │   ├── asyncHandler.js
│   │   └── generateToken.js
│   │
│   ├── seed.js
│   └── index.js
│
├── supply-chain-frontend
│   │
│   ├── src
│   │   │
│   │   ├── api
│   │   │   └── axios.js
│   │   │
│   │   ├── components
│   │   │   ├── AppLayout.jsx
│   │   │   ├── Charts.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StatusTimeline.jsx
│   │   │
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── lib
│   │   │   └── socket.js
│   │   │
│   │   ├── pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Tracking.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── styles
│   │   └── assets
│   │
│   └── public
│
└── README.md
```

---

# 🚀 Core Modules

### Dashboard

Provides operational visibility through inventory statistics, shipment monitoring, low-stock alerts, delayed deliveries, and performance metrics.

### Inventory Management

Tracks inventory levels, supports stock updates, and highlights products requiring replenishment.

### Order Management

Manages the entire order lifecycle from creation to delivery with status tracking and validation.

### Shipment Tracking

Uses a live tracking simulator and Socket.IO to provide real-time shipment updates, ETA calculations, and route visualization.

### Authentication

Implements secure role-based access control for different operational users.

---

# 🎯 Future Enhancements

* Multi-Warehouse Management
* AI Demand Forecasting
* Route Optimization Engine
* Delivery Prediction Models
* QR & Barcode Integration
* Automated Procurement Recommendations
* Analytics & Reporting Suite
* Cloud Deployment
* Docker Support
* Microservices Architecture

---

# 👨‍💻 Author

**Arpit Mehrotra**

Computer Science Engineer | Full Stack Developer | AI & Machine Learning Enthusiast

LinkedIn: Add Your Profile Link

GitHub: Add Your GitHub Profile

Email: Add Your Email
