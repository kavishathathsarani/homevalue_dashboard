import { useState, useMemo } from "react";

const allUsers = [
  { id: 1, initials: "JD", name: "John Doe",      email: "john.doe@email.com",      status: "active",    joinDate: "Jan 15, 2024", predictions: 23, premium: true  },
  { id: 2, initials: "JS", name: "Jane Smith",     email: "jane.smith@email.com",    status: "inactive",  joinDate: "Dec 8, 2023",  predictions: 7,  premium: false },
  { id: 3, initials: "MB", name: "Michael Brown",  email: "michael.brown@email.com", status: "suspended", joinDate: "Nov 22, 2023", predictions: 45, premium: true  },
  { id: 4, initials: "SW", name: "Sarah Wilson",   email: "sarah.wilson@email.com",  status: "active",    joinDate: "Feb 3, 2024",  predictions: 12, premium: false },
  { id: 5, initials: "DL", name: "David Lee",      email: "david.lee@email.com",     status: "active",    joinDate: "Jan 28, 2024", predictions: 8,  premium: true  },
  { id: 6, initials: "AP", name: "Ava Perera",     email: "ava.perera@email.com",    status: "active",    joinDate: "Mar 1, 2024",  predictions: 31, premium: true  },
  { id: 7, initials: "RK", name: "Rajan Kumar",    email: "rajan.kumar@email.com",   status: "inactive",  joinDate: "Oct 10, 2023", predictions: 3,  premium: false },
  { id: 8, initials: "LM", name: "Laura Mendez",   email: "laura.m@email.com",       status: "active",    joinDate: "Feb 20, 2024", predictions: 19, premium: false },
];

const STATUS = {
  active:    { bg: "#dcfce7", color: "#166534", dot: "#16a34a" },
  inactive:  { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
  suspended: { bg: "#fee2e2", color: "#991b1b", dot: "#dc2626" },
};

const FILTERS = ["All", "Active", "Inactive", "Suspended", "Premium"];

const AVATAR_COLORS = {
  active:    "#b91c1c",
  inactive:  "#94a3b8",
  suspended: "#64748b",
};

export default function UsersPage() {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("All");
  const [users,  setUsers]    = useState(allUsers);

  const filtered = useMemo(() => users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchF =
      filter === "All"      ? true :
      filter === "Premium"  ? u.premium :
      u.status === filter.toLowerCase();
    return matchQ && matchF;
  }), [search, filter, users]);

  const toggle = (id) => setUsers(prev => prev.map(u =>
    u.id !== id ? u : { ...u, status: u.status === "suspended" ? "active" : "suspended" }
  ));

  const stats = [
    { label: "Total Users",  value: 97,    sub: "+12% this month", bar: 72, barColor: "#b91c1c" },
    { label: "Active",       value: 61,    sub: "63% of total",    bar: 63, barColor: "#16a34a" },
    { label: "Premium",      value: 38,    sub: "39% conversion",  bar: 39, barColor: "#d97706" },
    { label: "Suspended",    value: 8,     sub: "8% of total",     bar: 8,  barColor: "#dc2626" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, height: "100%", overflow: "hidden" }}>

      {/* ── TOP BAR ── */}
      <div style={{
        flexShrink: 0, background: "#fff", borderBottom: "1px solid #e8e2e2",
        padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1c1212", margin: 0 }}>User Management</p>
          <p style={{ fontSize: 12, color: "#9b8888", margin: "2px 0 0" }}>Manage and monitor all registered users</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9b8888", fontSize: 14, pointerEvents: "none" }}>⌕</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              style={{
                width: 260, border: "1px solid #e8e2e2", borderRadius: 8,
                padding: "8px 12px 8px 32px", fontSize: 13, fontFamily: "inherit",
                background: "#faf7f7", color: "#1c1212", outline: "none",
              }}
            />
          </div>
          <button style={{
            background: "#b91c1c", color: "#fff", border: "none", borderRadius: 8,
            padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
          }}>+ Add User</button>
        </div>
      </div>

      {/* ── scrollable body ── */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, padding: "18px 24px 0" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e8e2e2", borderRadius: 10, padding: "15px 16px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#9b8888", margin: "0 0 5px" }}>{s.label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: "#1c1212", lineHeight: 1, margin: "0 0 4px" }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "#9b8888", margin: "0 0 8px" }}>{s.sub}</p>
              <div style={{ height: 3, background: "#f0eaea", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.bar}%`, background: s.barColor, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Filter row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px 10px", flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
                padding: "5px 13px", borderRadius: 6, border: "1px solid",
                borderColor: filter === f ? "#b91c1c" : "#e8e2e2",
                background: filter === f ? "#b91c1c" : "#fff",
                color: filter === f ? "#fff" : "#9b8888",
              }}
            >{f}</button>
          ))}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: "#9b8888" }}>{filtered.length} of 97 users</span>
        </div>

        {/* Table */}
        <div style={{ margin: "0 24px 24px", background: "#fff", border: "1px solid #e8e2e2", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 700 }}>
              <thead>
                <tr style={{ background: "#faf7f7", borderBottom: "1px solid #e8e2e2" }}>
                  {["User", "Status", "Join Date", "Predictions", "Plan", "Actions"].map(h => (
                    <th key={h} style={{
                      textAlign: "left", padding: "11px 16px",
                      fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                      letterSpacing: "0.5px", color: "#9b8888", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => {
                  const sc = STATUS[u.status];
                  return (
                    <tr key={u.id} style={{ borderBottom: "1px solid #f0eaea", background: i % 2 === 0 ? "#fff" : "#fdf9f9" }}>

                      {/* User */}
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                            background: AVATAR_COLORS[u.status] || "#b91c1c",
                            color: "#fff", display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: 11, fontWeight: 700,
                          }}>{u.initials}</div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: 13, color: "#1c1212", margin: 0 }}>{u.name}</p>
                            <p style={{ fontSize: 11, color: "#9b8888", margin: "1px 0 0" }}>{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "12px 16px", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                          background: sc.bg, color: sc.color,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                          {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                        </span>
                      </td>

                      {/* Join Date */}
                      <td style={{ padding: "12px 16px", verticalAlign: "middle", color: "#9b8888", fontSize: 12, whiteSpace: "nowrap" }}>{u.joinDate}</td>

                      {/* Predictions */}
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13 }}>{u.predictions}</span>
                      </td>

                      {/* Plan */}
                      <td style={{ padding: "12px 16px", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                        {u.premium
                          ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "#fef3c7", color: "#92400e" }}>★ Premium</span>
                          : <span style={{ fontSize: 12, color: "#9b8888" }}>Free</span>
                        }
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "12px 16px", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {["Edit", "View"].map(a => (
                            <button key={a} style={{
                              fontFamily: "inherit", fontSize: 12, fontWeight: 500, cursor: "pointer",
                              padding: "4px 10px", borderRadius: 6, border: "1px solid #e8e2e2",
                              background: "#fff", color: "#4a3030",
                            }}>{a}</button>
                          ))}
                          <button
                            onClick={() => toggle(u.id)}
                            style={{
                              fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
                              padding: "4px 10px", borderRadius: 6, border: "1px solid",
                              borderColor: u.status === "suspended" ? "#bbf7d0" : "#fecaca",
                              background: u.status === "suspended" ? "#f0fdf4" : "#fff5f5",
                              color: u.status === "suspended" ? "#166534" : "#b91c1c",
                            }}
                          >{u.status === "suspended" ? "Activate" : "Suspend"}</button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{
            padding: "13px 16px", display: "flex", justifyContent: "space-between",
            alignItems: "center", borderTop: "1px solid #e8e2e2",
          }}>
            <span style={{ fontSize: 12, color: "#9b8888" }}>Showing 1–{filtered.length} of 97 results</span>
            <div style={{ display: "flex", gap: 4 }}>
              {["← Prev", "1", "2", "3", "Next →"].map((p, i) => (
                <button key={i} style={{
                  fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                  minWidth: 30, height: 30, padding: "0 8px", borderRadius: 6,
                  border: "1px solid", cursor: "pointer",
                  borderColor: p === "1" ? "#b91c1c" : "#e8e2e2",
                  background: p === "1" ? "#b91c1c" : "#fff",
                  color: p === "1" ? "#fff" : "#9b8888",
                }}>{p}</button>
              ))}
            </div>
          </div>
        </div>

      </div>{/* end scrollable */}
    </div>
  );
}