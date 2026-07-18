import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { getSocket } from "../lib/socket";

const AppLayout = () => {
  const location = useLocation();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    setConnected(socket.connected);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar path={location.pathname} connected={connected} />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
