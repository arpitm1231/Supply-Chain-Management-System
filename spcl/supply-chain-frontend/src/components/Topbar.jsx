import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./Topbar.css";

const TITLES = {
  "/dashboard": "Dashboard",
  "/orders": "Orders",
  "/inventory": "Inventory",
  "/tracking": "Live Tracking",
};

const Topbar = ({ path, connected }) => {
  const { user, logout } = useAuth();
  const title = TITLES[path] || "SupplyLink";
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-right">
        <span className={`live-pill ${connected ? "" : "offline"}`}>
          <span className="live-dot" />
          {connected ? "Live" : "Offline"}
        </span>
        <div className="topbar-user">
          <div className="topbar-avatar">{initials}</div>
          <div className="topbar-user-info">
            <div className="topbar-user-name">{user?.name || "Guest"}</div>
            <div className="topbar-user-role">{user?.role}</div>
          </div>
          <button className="topbar-logout" onClick={logout} title="Log out">
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
