import React, { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Orders.css";
import "./Modal.css";

const STATUS_OPTIONS = ["pending", "shipped", "delivered", "cancelled"];

function Orders() {
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "order";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ product: "", quantity: "", route: "", priority: "normal" });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/orders");
      setOrders(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.product.toLowerCase().includes(search.toLowerCase()) ||
      order.route.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await API.post("/orders", { ...form, quantity: Number(form.quantity) });
      setShowModal(false);
      setForm({ product: "", quantity: "", route: "", priority: "normal" });
      fetchOrders();
    } catch (err) {
      const errs = err.response?.data?.errors;
      setFormError(errs?.length ? errs.map((x) => x.message).join(", ") : err.response?.data?.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await API.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete order");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Track and manage every order moving through your network.</p>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> New Order
          </button>
        )}
      </div>

      {error && <div className="dash-error">{error}</div>}

      <div className="orders-controls">
        <div className="search-wrap">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="input"
            placeholder="Search by product or route"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input status-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="order-summary">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>

      <div className="card orders-table-wrapper">
        {loading ? (
          <div style={{ padding: 24 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8 }} />)}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">No orders match your filters.</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Route</th>
                <th>Quantity</th>
                <th>Priority</th>
                <th>Status</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="cell-strong">{order.product}</td>
                  <td>{order.route}</td>
                  <td>{order.quantity}</td>
                  <td><span className={`badge badge-neutral`}>{order.priority || "normal"}</span></td>
                  <td>
                    <span className={`badge badge-${order.status}`}>
                      <span className="badge-dot" />
                      {order.status}
                    </span>
                  </td>
                  {canManage && (
                    <td>
                      <div className="row-actions">
                        <select
                          className="input status-select-sm"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        <button className="icon-btn danger" onClick={() => handleDelete(order._id)} title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>New Order</h2>
            <p className="subtitle">Route must be "Origin City to Destination City".</p>
            {formError && <div className="auth-alert">{formError}</div>}
            <form onSubmit={handleCreate}>
              <div className="form-field">
                <label>Product</label>
                <input className="input" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Quantity</label>
                <input type="number" min="1" className="input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Route</label>
                <input className="input" placeholder="Mumbai to Delhi" value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Priority</label>
                <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
