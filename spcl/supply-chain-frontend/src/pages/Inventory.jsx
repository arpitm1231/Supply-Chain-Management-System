import React, { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Inventory.css";
import "./Modal.css";

function InventoryPage() {
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "inventory";

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [newItem, setNewItem] = useState({ product: "", stock: "", city: "" });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/inventory");
      setInventory(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await API.post("/inventory", { ...newItem, stock: parseInt(newItem.stock, 10) });
      setShowModal(false);
      setNewItem({ product: "", stock: "", city: "" });
      fetchInventory();
    } catch (err) {
      const errs = err.response?.data?.errors;
      setFormError(errs?.length ? errs.map((x) => x.message).join(", ") : err.response?.data?.message || "Failed to add item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await API.delete(`/inventory/${_id}`);
      setInventory((prev) => prev.filter((item) => item._id !== _id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete item");
    }
  };

  const handleRestock = async (_id) => {
    const item = inventory.find((i) => i._id === _id);
    if (!item) return;
    try {
      const { data } = await API.patch(`/inventory/${_id}`, { stock: item.stock + 100 });
      setInventory((prev) => prev.map((i) => (i._id === _id ? data : i)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to restock item");
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock =
      stockFilter === "low" ? item.stock < 100 : stockFilter === "in" ? item.stock >= 100 : true;
    return matchesSearch && matchesStock;
  });

  const lowStockCount = inventory.filter((item) => item.stock < 100).length;
  const totalStock = inventory.reduce((acc, item) => acc + item.stock, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Inventory</h1>
          <p>Monitor stock levels across every warehouse city.</p>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Item
          </button>
        )}
      </div>

      {error && <div className="dash-error">{error}</div>}

      <div className="inventory-summary">
        <div className="card summary-card">
          <div className="summary-value">{inventory.length}</div>
          <div className="summary-label">Total Products</div>
        </div>
        <div className="card summary-card low">
          <div className="summary-value">{lowStockCount}</div>
          <div className="summary-label">Low Stock</div>
        </div>
        <div className="card summary-card">
          <div className="summary-value">{totalStock.toLocaleString()}</div>
          <div className="summary-label">Total Units</div>
        </div>
      </div>

      <div className="orders-controls">
        <div className="search-wrap">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="input"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="input status-select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
          <option value="all">All stock levels</option>
          <option value="in">In stock (100+)</option>
          <option value="low">Low stock (&lt;100)</option>
        </select>
      </div>

      <div className="card orders-table-wrapper">
        {loading ? (
          <div style={{ padding: 24 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8 }} />)}
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="empty-state">No inventory items match your filters.</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>City</th>
                <th>Status</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item._id} className={item.stock < 100 ? "low-stock-row" : ""}>
                  <td className="cell-strong">{item.product}</td>
                  <td>{item.stock.toLocaleString()}</td>
                  <td>{item.city}</td>
                  <td>
                    {item.stock < 100 ? (
                      <span className="badge badge-pending"><FaExclamationTriangle size={10} /> Low</span>
                    ) : (
                      <span className="badge badge-delivered">In stock</span>
                    )}
                  </td>
                  {canManage && (
                    <td>
                      <div className="row-actions">
                        {item.stock < 100 && (
                          <button className="btn btn-secondary btn-sm" onClick={() => handleRestock(item._id)}>
                            Restock +100
                          </button>
                        )}
                        <button className="icon-btn danger" onClick={() => handleDelete(item._id)} title="Delete">
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
            <h2>Add Inventory Item</h2>
            {formError && <div className="auth-alert">{formError}</div>}
            <form onSubmit={handleAddItem}>
              <div className="form-field">
                <label>Product</label>
                <input className="input" value={newItem.product} onChange={(e) => setNewItem({ ...newItem, product: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Stock</label>
                <input type="number" min="0" className="input" value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>City</label>
                <input className="input" value={newItem.city} onChange={(e) => setNewItem({ ...newItem, city: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;
