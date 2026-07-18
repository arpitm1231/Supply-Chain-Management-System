import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaSearch, FaTruck, FaBoxOpen, FaMapMarkerAlt, FaFlagCheckered,
} from "react-icons/fa";
import API from "../api/axios";
import { getSocket } from "../lib/socket";
import StatusTimeline from "../components/StatusTimeline";
import "./Tracking.css";

const STATUS_FILTERS = ["all", "pending", "shipped", "delivered", "cancelled"];

const originIcon = L.divIcon({
  className: "map-pin origin",
  html: '<span></span>',
  iconSize: [14, 14],
});
const destinationIcon = L.divIcon({
  className: "map-pin destination",
  html: '<span></span>',
  iconSize: [14, 14],
});
const truckIcon = (status) =>
  L.divIcon({
    className: `truck-marker status-${status}`,
    html: '<div class="truck-pulse"></div><div class="truck-dot"></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });

// Smoothly moves the map to a shipment's live location when it's selected.
const MapFocus = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 6), { duration: 0.9 });
  }, [target, map]);
  return null;
};

const formatETA = (eta, deliveredAt) => {
  if (deliveredAt) return "Delivered";
  if (!eta) return "—";
  const diffMs = new Date(eta).getTime() - Date.now();
  if (diffMs <= 0) return "Overdue";
  const h = Math.floor(diffMs / 3.6e6);
  const m = Math.round((diffMs % 3.6e6) / 6e4);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const Tracking = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [, forceTick] = useState(0); // re-render every second to keep ETA countdowns live

  // Smoothed marker positions, interpolated toward each shipment's latest
  // server-reported location so movement between socket ticks looks fluid
  // instead of jumping every 4s.
  const displayPositions = useRef({});

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const { data } = await API.get("/tracking");
        setShipments(data);
        data.forEach((s) => {
          displayPositions.current[s.id] = { ...s.currentLocation };
        });
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || "Failed to load tracking data");
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, []);

  // Live updates from the backend simulator
  useEffect(() => {
    const socket = getSocket();

    const onUpdate = (update) => {
      setShipments((prev) =>
        prev.map((s) => (s.id === update.id ? { ...s, ...update } : s))
      );
    };
    const onCreated = () => API.get("/tracking").then(({ data }) => setShipments(data)).catch(() => {});
    const onDeleted = ({ id }) => setShipments((prev) => prev.filter((s) => s.id !== id));

    socket.on("tracking:update", onUpdate);
    socket.on("order:created", onCreated);
    socket.on("order:deleted", onDeleted);

    return () => {
      socket.off("tracking:update", onUpdate);
      socket.off("order:created", onCreated);
      socket.off("order:deleted", onDeleted);
    };
  }, []);

  // Countdown ticker + position interpolation loop
  useEffect(() => {
    const id = setInterval(() => {
      shipments.forEach((s) => {
        const disp = displayPositions.current[s.id];
        const target = s.currentLocation;
        if (!disp || !target) return;
        displayPositions.current[s.id] = {
          lat: disp.lat + (target.lat - disp.lat) * 0.18,
          lng: disp.lng + (target.lng - disp.lng) * 0.18,
        };
      });
      forceTick((t) => t + 1);
    }, 250);
    return () => clearInterval(id);
  }, [shipments]);

  const filteredShipments = useMemo(
    () =>
      shipments.filter((s) => {
        const matchSearch =
          s.product.toLowerCase().includes(search.toLowerCase()) ||
          s.route.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || s.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [shipments, search, statusFilter]
  );

  const selected = shipments.find((s) => s.id === selectedId) || null;
  const selectedDisplayPos = selected ? displayPositions.current[selected.id] : null;

  const counts = {
    total: shipments.length,
    pending: shipments.filter((s) => s.status === "pending").length,
    shipped: shipments.filter((s) => s.status === "shipped").length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
  };

  return (
    <div className="tracking-page">
      <aside className="tracking-sidebar">
        <div className="tracking-stats">
          <div className="tstat"><span>{counts.total}</span>Total</div>
          <div className="tstat pending"><span>{counts.pending}</span>Pending</div>
          <div className="tstat shipped"><span>{counts.shipped}</span>In Transit</div>
          <div className="tstat delivered"><span>{counts.delivered}</span>Delivered</div>
        </div>

        <div className="tracking-search">
          <FaSearch className="search-icon" />
          <input className="input" placeholder="Search product or route" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="status-chips">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              className={`chip ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {error && <div className="dash-error">{error}</div>}

        <div className="shipment-list">
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 76, marginBottom: 10 }} />)
          ) : filteredShipments.length === 0 ? (
            <div className="empty-state">No shipments match your filters.</div>
          ) : (
            filteredShipments.map((s) => (
              <button
                key={s.id}
                className={`shipment-card ${selectedId === s.id ? "selected" : ""}`}
                onClick={() => setSelectedId(s.id)}
              >
                <div className="shipment-card-top">
                  <span className="shipment-product"><FaBoxOpen /> {s.product}</span>
                  <span className={`badge badge-${s.status}`}><span className="badge-dot" />{s.status}</span>
                </div>
                <div className="shipment-route">
                  <FaMapMarkerAlt size={10} /> {s.originCity} <span className="arrow">→</span> {s.destinationCity}
                </div>
                {s.status === "shipped" && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${s.progress}%` }} />
                  </div>
                )}
                <div className="shipment-eta">
                  ETA: <strong>{formatETA(s.eta, s.deliveredAt)}</strong>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <div className="tracking-map-wrap">
        <MapContainer center={[22.9734, 78.6569]} zoom={5} className="tracking-map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          {selectedDisplayPos && <MapFocus target={selectedDisplayPos} />}

          {filteredShipments.map((s) => {
            const pos = displayPositions.current[s.id] || s.currentLocation;
            const isSelected = s.id === selectedId;
            return (
              <React.Fragment key={s.id}>
                <Polyline
                  positions={[[s.origin.lat, s.origin.lng], [s.destination.lat, s.destination.lng]]}
                  pathOptions={{ color: isSelected ? "#4f46e5" : "#d1d5db", weight: isSelected ? 3 : 2, dashArray: "6 8" }}
                />
                <Marker position={[s.origin.lat, s.origin.lng]} icon={originIcon} />
                <Marker position={[s.destination.lat, s.destination.lng]} icon={destinationIcon} />
                {s.status !== "cancelled" && pos && (
                  <Marker
                    position={[pos.lat, pos.lng]}
                    icon={truckIcon(s.status)}
                    eventHandlers={{ click: () => setSelectedId(s.id) }}
                  >
                    <Popup>
                      <strong>{s.product}</strong><br />
                      {s.originCity} → {s.destinationCity}<br />
                      Status: {s.status}<br />
                      ETA: {formatETA(s.eta, s.deliveredAt)}
                    </Popup>
                  </Marker>
                )}
              </React.Fragment>
            );
          })}
        </MapContainer>

        {selected && (
          <div className="detail-panel">
            <div className="detail-header">
              <div>
                <div className="detail-product"><FaTruck /> {selected.product}</div>
                <div className="detail-route">{selected.originCity} <span className="arrow">→</span> {selected.destinationCity}</div>
              </div>
              <button className="icon-btn" onClick={() => setSelectedId(null)}>✕</button>
            </div>

            <div className="detail-meta">
              <div><span>Quantity</span><strong>{selected.quantity}</strong></div>
              <div><span>Priority</span><strong style={{ textTransform: "capitalize" }}>{selected.priority}</strong></div>
              <div><span>Progress</span><strong>{Math.round(selected.progress)}%</strong></div>
              <div><span>ETA</span><strong>{formatETA(selected.eta, selected.deliveredAt)}</strong></div>
            </div>

            {selected.status === "shipped" && (
              <div className="progress-bar large">
                <div className="progress-fill" style={{ width: `${selected.progress}%` }} />
              </div>
            )}

            <StatusTimeline status={selected.status} statusHistory={selected.statusHistory} />
          </div>
        )}

        {!selected && !loading && (
          <div className="map-hint"><FaFlagCheckered /> Select a shipment to see live details</div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
