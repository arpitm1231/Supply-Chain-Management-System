import React, { useEffect, useState } from "react";
import {
  FaBoxOpen, FaExclamationTriangle, FaClipboardList, FaTruckLoading,
  FaClock, FaCheckCircle, FaFire, FaTimesCircle,
} from "react-icons/fa";
import API from "../api/axios";
import Charts from "../components/Charts";
import "./Dashboard.css";

const METRIC_CARDS = [
  { key: "totalInventory", label: "Total Inventory", icon: <FaBoxOpen />, tone: "info" },
  { key: "lowStock", label: "Low Stock Items", icon: <FaExclamationTriangle />, tone: "warning" },
  { key: "totalOrders", label: "Total Orders", icon: <FaClipboardList />, tone: "neutral" },
  { key: "ordersInTransit", label: "In Transit", icon: <FaTruckLoading />, tone: "info" },
  { key: "delayedOrders", label: "Delayed", icon: <FaClock />, tone: "warning" },
  { key: "deliveredOrders", label: "Delivered", icon: <FaCheckCircle />, tone: "success" },
  { key: "criticalDelayed", label: "Critical Delays", icon: <FaFire />, tone: "danger" },
  { key: "cancelledOrders", label: "Cancelled", icon: <FaTimesCircle />, tone: "neutral" },
];

const formatMinutes = (mins) => {
  if (!mins) return "—";
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await API.get("/dashboard");
        setMetrics(data.metrics);
        setTrends(data.trends);
        setInventoryData(data.inventoryData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>A live snapshot of inventory, orders, and delivery performance.</p>
        </div>
      </div>

      {error && <div className="dash-error">{error}</div>}

      <div className="metric-grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton metric-skel" />)
          : METRIC_CARDS.map((c) => (
              <div className={`metric-card tone-${c.tone}`} key={c.key}>
                <div className="metric-icon">{c.icon}</div>
                <div>
                  <div className="metric-value">{metrics?.[c.key] ?? 0}</div>
                  <div className="metric-label">{c.label}</div>
                </div>
              </div>
            ))}
        {!loading && (
          <div className="metric-card tone-neutral">
            <div className="metric-icon"><FaClock /></div>
            <div>
              <div className="metric-value">{formatMinutes(metrics?.averageETA)}</div>
              <div className="metric-label">Avg. Delivery Time</div>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-charts">
        {loading ? (
          <div className="skeleton" style={{ height: 320 }} />
        ) : trends && inventoryData ? (
          <Charts trends={trends} inventoryData={inventoryData} />
        ) : (
          <div className="empty-state">No data available yet — add some inventory and orders.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
