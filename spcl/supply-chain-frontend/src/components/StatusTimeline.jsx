import React from "react";
import { FaClock, FaTruck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const STEPS = [
  { key: "pending", label: "Order Placed", icon: <FaClock /> },
  { key: "shipped", label: "In Transit", icon: <FaTruck /> },
  { key: "delivered", label: "Delivered", icon: <FaCheckCircle /> },
];

const formatTime = (iso) =>
  iso ? new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : null;

const StatusTimeline = ({ status, statusHistory = [] }) => {
  if (status === "cancelled") {
    return (
      <div className="timeline">
        <div className="timeline-step done cancelled">
          <div className="timeline-icon"><FaTimesCircle /></div>
          <div>
            <div className="timeline-label">Order Cancelled</div>
            <div className="timeline-time">{formatTime(statusHistory.at(-1)?.at)}</div>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="timeline">
      {STEPS.map((step, i) => {
        const historyEntry = statusHistory.find((h) => h.status === step.key);
        const isDone = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step.key} className={`timeline-step ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}>
            <div className="timeline-icon">{step.icon}</div>
            <div>
              <div className="timeline-label">{step.label}</div>
              <div className="timeline-time">{isDone ? formatTime(historyEntry?.at) || "—" : "Pending"}</div>
            </div>
            {i < STEPS.length - 1 && <div className={`timeline-connector ${i < currentIndex ? "done" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
