import React from "react";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";

const STATUS_COLORS = {
  pending: "#d97706",
  shipped: "#2563eb",
  delivered: "#16a34a",
  cancelled: "#dc2626",
};

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const truncate = (s, n = 10) => (s && s.length > n ? `${s.slice(0, n)}…` : s);

const Charts = ({ trends, inventoryData }) => {
  const shipmentsData = (trends || []).map((t) => ({ ...t, label: capitalize(t._id) }));
  const lowStockData = (inventoryData || []).filter((item) => item.stock < 100);
  const chartInventoryData = (inventoryData || []).map((item) => ({
    ...item,
    shortLabel: truncate(item.product),
  }));
  // Give every bar a fixed 70px slot so labels never crowd each other,
  // however many products there are — the chart scrolls horizontally instead.
  const inventoryChartWidth = Math.max(chartInventoryData.length * 70, 500);

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3>Inventory Stock Levels</h3>
        <div style={{ overflowX: "auto" }}>
          <BarChart
            data={chartInventoryData}
            width={inventoryChartWidth}
            height={300}
            margin={{ bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="shortLabel" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.product || ""} />
            <Legend />
            <Bar dataKey="stock" fill="#4f46e5" name="Stock" radius={[6, 6, 0, 0]} barSize={28} />
          </BarChart>
        </div>
      </div>

      <div className="chart-card">
        <h3>Low Stock Items</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={[
                { name: "Low Stock", value: lowStockData.length },
                { name: "Normal Stock", value: Math.max((inventoryData || []).length - lowStockData.length, 0) },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
            >
              <Cell fill="#d97706" />
              <Cell fill="#4f46e5" />
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Orders by Status</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={shipmentsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" name="Orders" radius={[6, 6, 0, 0]}>
              {shipmentsData.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLORS[entry._id] || "#6b7280"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;