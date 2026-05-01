import { useEffect, useMemo, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatCompact = (num) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num || 0);

const formatLKRCompact = (num) => {
  const value = num || 0;
  if (value >= 1_000_000) return `LKR ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `LKR ${(value / 1_000).toFixed(1)}K`;
  return `LKR ${value.toFixed(0)}`;
};

const timeAgo = (dateValue) => {
  const seconds = Math.floor((Date.now() - new Date(dateValue).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

export default function OverviewPage() {
  const [users, setUsers] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        setError("");

        const [usersRes, predictionsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BACKEND_URL}/api/predictions/admin/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!usersRes.ok || !predictionsRes.ok) {
          throw new Error("Failed to load overview statistics");
        }

        const usersData = await usersRes.json();
        const predictionsData = await predictionsRes.json();

        setUsers(usersData.data || []);
        setPredictions(predictionsData.data || []);
      } catch (err) {
        setError(err.message || "Unable to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const derived = useMemo(() => {
    const totalPredictions = predictions.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const totalUsers = users.length;

    const totalPredictedValue = predictions.reduce(
      (sum, p) => sum + (p.predictedPrice || 0),
      0
    );
    const avgPropertyPrice = totalPredictions
      ? totalPredictedValue / totalPredictions
      : 0;

    const currentMonth = new Date();
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);

    const inCurrentMonth = (d) => {
      const dt = new Date(d);
      return (
        dt.getMonth() === currentMonth.getMonth() &&
        dt.getFullYear() === currentMonth.getFullYear()
      );
    };

    const inPrevMonth = (d) => {
      const dt = new Date(d);
      return dt.getMonth() === prevMonth.getMonth() && dt.getFullYear() === prevMonth.getFullYear();
    };

    const currentMonthPredictions = predictions.filter((p) => inCurrentMonth(p.createdAt)).length;
    const prevMonthPredictions = predictions.filter((p) => inPrevMonth(p.createdAt)).length;

    const predictionChangePct = prevMonthPredictions
      ? ((currentMonthPredictions - prevMonthPredictions) / prevMonthPredictions) * 100
      : currentMonthPredictions > 0
      ? 100
      : 0;

    const currentMonthUsers = users.filter((u) => inCurrentMonth(u.joinDate)).length;
    const prevMonthUsers = users.filter((u) => inPrevMonth(u.joinDate)).length;
    const userChangePct = prevMonthUsers
      ? ((currentMonthUsers - prevMonthUsers) / prevMonthUsers) * 100
      : currentMonthUsers > 0
      ? 100
      : 0;

    const districts = predictions.reduce((acc, p) => {
      const key = p.predictionInput?.district || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topLocations = Object.entries(districts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count], idx) => ({
        name,
        count,
        pct: totalPredictions ? Math.max(6, Math.round((count / totalPredictions) * 100)) : 0,
        color: idx === 0 ? "#b91c1c" : "#e8d0d0",
      }));

    const recentPredictionActivity = predictions.slice(0, 5).map((p) => {
      const fullName = p.userId?.fullName || "Unknown User";
      const initials = fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return {
        initials,
        name: fullName,
        action: "made a prediction",
        loc: p.predictionInput?.city || p.predictionInput?.district || null,
        time: timeAgo(p.createdAt),
        color: "#b91c1c",
      };
    });

    return {
      totalPredictions,
      activeUsers,
      totalUsers,
      avgPropertyPrice,
      predictionChangePct,
      userChangePct,
      topLocations,
      recentPredictionActivity,
      topCity: topLocations[0]?.name || "N/A",
    };
  }, [predictions, users]);

  const metrics = [
    {
      label: "Total Predictions",
      value: formatCompact(derived.totalPredictions),
      change: `${derived.predictionChangePct >= 0 ? "+" : ""}${derived.predictionChangePct.toFixed(1)}%`,
      up: derived.predictionChangePct >= 0,
      color: "#b91c1c",
      bar: Math.min(100, Math.max(8, derived.totalPredictions ? 70 : 8)),
    },
    {
      label: "Active Users",
      value: formatCompact(derived.activeUsers),
      change: `${derived.userChangePct >= 0 ? "+" : ""}${derived.userChangePct.toFixed(1)}%`,
      up: derived.userChangePct >= 0,
      color: "#16a34a",
      bar: derived.totalUsers ? Math.round((derived.activeUsers / derived.totalUsers) * 100) : 0,
    },
    {
      label: "Avg Property Price",
      value: formatLKRCompact(derived.avgPropertyPrice),
      change: `${derived.totalPredictions} records`,
      up: true,
      color: "#d97706",
      bar: derived.avgPropertyPrice > 0 ? 58 : 0,
    },
    {
      label: "Coverage",
      value: `${derived.topLocations.length} districts`,
      change: `${derived.totalUsers} users`,
      up: true,
      color: "#b91c1c",
      bar: Math.min(100, derived.topLocations.length * 20),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, height: "100%", overflow: "hidden" }}>

      {/* Top bar */}
      <div style={{ flexShrink: 0, background: "#fff", borderBottom: "1px solid #e8e2e2", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1c1212", margin: 0 }}>Dashboard Overview</p>
          <p style={{ fontSize: 12, color: "#9b8888", margin: "2px 0 0" }}>
            Welcome back, Admin · Today is {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
        {loading && (
          <div style={{ margin: "18px 24px 0", background: "#fff", border: "1px solid #e8e2e2", borderRadius: 10, padding: "14px 16px", color: "#9b8888", fontSize: 13 }}>
            Loading overview data...
          </div>
        )}
        {error && (
          <div style={{ margin: "18px 24px 0", background: "#fff", border: "1px solid #fecaca", borderRadius: 10, padding: "14px 16px", color: "#b91c1c", fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, padding: "18px 24px 0" }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e8e2e2", borderRadius: 10, padding: "15px 16px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#9b8888", margin: "0 0 5px" }}>{m.label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: "#1c1212", lineHeight: 1, margin: "0 0 5px" }}>{m.value}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: m.up ? "#16a34a" : "#dc2626" }}>{m.up ? "▲" : "▼"} {m.change}</span>
                <span style={{ fontSize: 11, color: "#9b8888" }}>database live</span>
              </div>
              <div style={{ height: 3, background: "#f0eaea", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${m.bar}%`, background: m.color, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Two col */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "14px 24px 24px" }}>

          {/* Recent Activity */}
          <div style={{ background: "#fff", border: "1px solid #e8e2e2", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1c1212", margin: 0 }}>Recent Activity</p>
              <button style={{ fontSize: 12, color: "#b91c1c", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>View all →</button>
            </div>
            {derived.recentPredictionActivity.length === 0 && (
              <p style={{ margin: 0, fontSize: 12, color: "#9b8888" }}>No recent activity yet.</p>
            )}
            {derived.recentPredictionActivity.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 0", borderBottom: i < derived.recentPredictionActivity.length - 1 ? "1px solid #f0eaea" : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: a.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{a.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1c1212", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.name} <span style={{ fontWeight: 400, color: "#9b8888" }}>{a.action}</span>
                  </p>
                  {a.loc && <p style={{ fontSize: 11, color: "#9b8888", margin: "2px 0 0" }}>📍 {a.loc}</p>}
                </div>
                <span style={{ fontSize: 11, color: "#c4b0b0", flexShrink: 0 }}>{a.time}</span>
              </div>
            ))}
          </div>

          {/* Top Locations */}
          <div style={{ background: "#fff", border: "1px solid #e8e2e2", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1c1212", margin: 0 }}>Top Prediction Locations</p>
              <button style={{ fontSize: 12, color: "#b91c1c", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>View map →</button>
            </div>
            {derived.topLocations.length === 0 && (
              <p style={{ margin: 0, fontSize: 12, color: "#9b8888" }}>No location data available.</p>
            )}
            {derived.topLocations.map((loc, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1c1212" }}>{loc.name}</span>
                  <span style={{ fontSize: 12, color: "#9b8888" }}>{loc.count} predictions</span>
                </div>
                <div style={{ height: 4, background: "#f0eaea", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${loc.pct}%`, background: loc.color, borderRadius: 99 }} />
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-around", borderTop: "1px solid #f0eaea", paddingTop: 14, marginTop: 4 }}>
              {[
                { val: formatCompact(derived.totalUsers), label: "Total Users", color: "#b91c1c" },
                { val: derived.topCity, label: "Top City", color: "#b91c1c" },
                { val: formatLKRCompact(derived.avgPropertyPrice), label: "Avg Value", color: "#16a34a" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: s.color, margin: 0 }}>{s.val}</p>
                  <p style={{ fontSize: 11, color: "#9b8888", margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.4px" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}