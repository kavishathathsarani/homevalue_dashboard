const metrics = [
  { label: "Total Predictions", value: "1,247", change: "+18%", up: true,  color: "#b91c1c", bar: 74 },
  { label: "Active Users",      value: "61",    change: "+5%",  up: true,  color: "#16a34a", bar: 63 },
  { label: "Avg Property Price",value: "$485K", change: "+3.2%",up: true,  color: "#d97706", bar: 55 },
  { label: "Accuracy Rate",     value: "94.2%", change: "-0.3%",up: false, color: "#b91c1c", bar: 94 },
];

const activity = [
  { initials: "JD", name: "John Doe",     action: "Made a prediction",   loc: "Colombo 05", time: "2 min ago",  color: "#b91c1c" },
  { initials: "AP", name: "Ava Perera",   action: "Upgraded to Premium", loc: null,          time: "14 min ago", color: "#d97706" },
  { initials: "SW", name: "Sarah Wilson", action: "Registered",          loc: "Nugegoda",   time: "1 hr ago",   color: "#16a34a" },
  { initials: "MB", name: "Michael Brown",action: "Account suspended",   loc: null,          time: "3 hr ago",   color: "#64748b" },
  { initials: "RK", name: "Rajan Kumar",  action: "Made a prediction",   loc: "Kandy",      time: "5 hr ago",   color: "#b91c1c" },
];

const locations = [
  { name: "Colombo",  count: 423, pct: 92, color: "#b91c1c" },
  { name: "Nugegoda", count: 218, pct: 47, color: "#e8d0d0" },
  { name: "Kandy",    count: 176, pct: 38, color: "#e8d0d0" },
  { name: "Galle",    count: 134, pct: 29, color: "#e8d0d0" },
  { name: "Negombo",  count: 98,  pct: 21, color: "#e8d0d0" },
];

export default function OverviewPage() {
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
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button style={{ background: "#fff", color: "#4a3030", border: "1px solid #e8e2e2", borderRadius: 8, padding: "9px 16px", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Export Report</button>
          <button style={{ background: "#b91c1c", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ New Entry</button>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, padding: "18px 24px 0" }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e8e2e2", borderRadius: 10, padding: "15px 16px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#9b8888", margin: "0 0 5px" }}>{m.label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: "#1c1212", lineHeight: 1, margin: "0 0 5px" }}>{m.value}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: m.up ? "#16a34a" : "#dc2626" }}>{m.up ? "▲" : "▼"} {m.change}</span>
                <span style={{ fontSize: 11, color: "#9b8888" }}>vs last month</span>
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
            {activity.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 0", borderBottom: i < activity.length - 1 ? "1px solid #f0eaea" : "none" }}>
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
            {locations.map((loc, i) => (
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
                { val: "342",     label: "Total Users", color: "#b91c1c" },
                { val: "Colombo", label: "Top City",    color: "#b91c1c" },
                { val: "94.2%",   label: "Accuracy",   color: "#16a34a" },
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