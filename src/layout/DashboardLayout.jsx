const navItems = [
  { id: "overview", label: "Overview", icon: "⬡" },
  { id: "users", label: "Users", icon: "◉" },
  { id: "predictions", label: "Predictions", icon: "◎" },
  { id: "map", label: "Map Insights", icon: "◫" },
  { id: "reports", label: "Reports", icon: "◧" },
  { id: "settings", label: "Settings", icon: "◐" },
];

export default function DashboardLayout({ children, activePage = "users", onNavigate }) {
  return (
    <div style={{
      display: "flex", width: "100%", minHeight: "100vh", height: "100dvh",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: "#f6f4f4", color: "#1c1212", overflow: "hidden",
    }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 220, minWidth: 220, maxWidth: 220, flexShrink: 0,
        background: "#1a0505", display: "flex", flexDirection: "column",
        height: "100%", overflow: "hidden",
      }}>
        {/* Brand */}
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid #2d0a0a", flexShrink: 0 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#b91c1c", color: "#fff", borderRadius: 8,
            padding: "7px 12px", fontWeight: 700, fontSize: 13,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fca5a5" }} />
            Admin Portal
          </div>
          <p style={{ fontSize: 10, color: "#6b3030", marginTop: 8, letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Property Intelligence
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 7, cursor: "pointer",
                  color: isActive ? "#fff" : "#9b6e6e",
                  fontSize: 13, fontWeight: 500,
                  border: "none", background: isActive ? "#b91c1c" : "none",
                  width: "100%", textAlign: "left", fontFamily: "inherit",
                  position: "relative",
                }}
              >
                <span style={{ fontSize: 15, width: 18, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
                {item.label}
                {isActive && (
                  <span style={{
                    position: "absolute", right: 10, width: 5, height: 5,
                    borderRadius: "50%", background: "#fca5a5",
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid #2d0a0a", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: "#b91c1c",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>AD</div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#f9d8d8", margin: 0 }}>Admin</p>
              <p style={{ fontSize: 10, color: "#6b3030", margin: 0 }}>Super Admin</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <a href="#" style={{ fontSize: 11, color: "#9b6e6e", textDecoration: "none" }}>View Site</a>
            <a href="#" style={{ fontSize: 11, color: "#f87171", textDecoration: "none" }}>Logout</a>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{
        flex: 1, minWidth: 0, height: "100%",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {children}
      </main>

    </div>
  );
}