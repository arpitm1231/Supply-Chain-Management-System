import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaChartBar, FaBox, FaTruck, FaClipboardList } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: <FaChartBar className="icon" />, roles: ["admin", "order", "inventory"] },
  { to: "/orders", label: "Orders", icon: <FaClipboardList className="icon" />, roles: ["admin", "order"] },
  { to: "/inventory", label: "Inventory", icon: <FaBox className="icon" />, roles: ["admin", "inventory"] },
  { to: "/tracking", label: "Tracking", icon: <FaTruck className="icon" />, roles: ["admin", "order", "inventory"] },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();
  const visibleItems = NAV_ITEMS.filter((item) => !user || item.roles.includes(user.role));

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        {isOpen && (
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon"><FaTruck size={14} /></span>
            SupplyLink
          </div>
        )}
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle sidebar">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <nav>
        <ul>
          {visibleItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
                {item.icon}
                {isOpen && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {isOpen && <div className="sidebar-footer">SupplyLink v1.0</div>}
    </div>
  );
};

export default Sidebar;