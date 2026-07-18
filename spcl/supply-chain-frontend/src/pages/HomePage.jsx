import React from "react";
import { Link } from "react-router-dom";
import { FaTruck, FaBoxOpen, FaChartBar, FaClipboardList, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <nav className="home-nav">
        <div className="home-nav-brand">
          <span className="home-nav-icon"><FaTruck size={14} /></span>
          SupplyLink
        </div>
        <div className="home-nav-links">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Sign in</Link>
              <Link to="/register" className="btn btn-primary">Get started</Link>
            </>
          )}
        </div>
      </nav>

      <div className="home-hero">
        <div className="home-text">
          <span className="home-eyebrow">Real-time supply chain platform</span>
          <h1>Manage inventory, orders &amp; logistics with total visibility</h1>
          <p>
            SupplyLink gives your team a single, live view of stock levels, order status,
            and shipments moving across the country — updated the moment something changes.
          </p>
          <div className="home-buttons">
            <Link to={user ? "/dashboard" : "/register"} className="btn primary">
              {user ? "Open Dashboard" : "Start free"} <FaArrowRight />
            </Link>
            <Link to="/tracking" className="btn secondary">See live tracking</Link>
          </div>
        </div>
        <div className="home-cards">
          <div className="feature-card">
            <FaChartBar className="icon" />
            <h3>Analytics</h3>
            <p>Real-time insights on shipment delays, ETAs, and performance.</p>
          </div>
          <div className="feature-card">
            <FaClipboardList className="icon" />
            <h3>Orders</h3>
            <p>Track and manage orders across every route and location.</p>
          </div>
          <div className="feature-card">
            <FaBoxOpen className="icon" />
            <h3>Inventory</h3>
            <p>Monitor stock levels and get alerted the moment you run low.</p>
          </div>
          <div className="feature-card">
            <FaTruck className="icon" />
            <h3>Live Tracking</h3>
            <p>Watch shipments move in real time and catch delays early.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
