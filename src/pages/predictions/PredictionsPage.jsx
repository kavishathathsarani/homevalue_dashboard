import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/predictions/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPredictions(data.data || []);
        } else {
          setError("Failed to fetch predictions");
        }
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setError("Error loading predictions");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [token]);

  const formatLKR = (val) =>
    new Intl.NumberFormat("si-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(val);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate stats
  const stats = [
    { label: "Total Predictions", value: predictions.length, color: "#b91c1c", icon: "📊" },
    { label: "Total Value", value: formatLKR(predictions.reduce((sum, p) => sum + (p.predictedPrice || 0), 0)), color: "#16a34a", icon: "💰" },
    { label: "Avg Prediction", value: formatLKR(predictions.length > 0 ? predictions.reduce((sum, p) => sum + (p.predictedPrice || 0), 0) / predictions.length : 0), color: "#b91c1c", icon: "📈" },
    { label: "Active Users", value: new Set(predictions.map(p => p.userId?._id)).size, color: "#d97706", icon: "👥" },
  ];

  // Group by property type for summary
  const propertyTypeCounts = {};
  predictions.forEach((p) => {
    const type = p.predictionInput?.property_type || "Unknown";
    propertyTypeCounts[type] = (propertyTypeCounts[type] || 0) + 1;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, height: "100%", overflow: "hidden" }}>
      
      {/* Header */}
      <div style={{ flexShrink: 0, background: "#fff", borderBottom: "1px solid #e8e2e2", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1c1212", margin: 0 }}>Predictions</p>
          <p style={{ fontSize: 12, color: "#9b8888", margin: "2px 0 0" }}>AI-powered property valuation records</p>
        </div>
        <button style={{ background: "#b91c1c", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          🔄 Refresh Data
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "24px" }}>
        
        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e8e2e2", borderRadius: 10, padding: "15px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#9b8888", margin: "0 0 8px" }}>{s.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
                </div>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Property Type Summary */}
        <div style={{ background: "#fff", borderRadius: 10, padding: "16px", marginBottom: 24, border: "1px solid #e8e2e2" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1c1212", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Property Type Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
            {Object.entries(propertyTypeCounts).map(([type, count]) => (
              <div key={type} style={{ background: "#f6f4f4", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#9b8888", margin: "0 0 4px", textTransform: "uppercase" }}>{type}</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#b91c1c", margin: 0 }}>{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Predictions Table */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e8e2e2", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #e8e2e2", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {["All", "Apartment", "House", "Villa"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  padding: "5px 13px", borderRadius: 6, border: "1px solid",
                  borderColor: filter === f ? "#b91c1c" : "#e8e2e2",
                  background: filter === f ? "#b91c1c" : "#fff",
                  color: filter === f ? "#fff" : "#9b8888",
                }}>{f}</button>
              ))}
            </div>
            <span style={{ fontSize: 12, color: "#9b8888" }}>
              {filter === "All" ? predictions.length : predictions.filter(p => p.predictionInput?.property_type === filter).length} results
            </span>
          </div>

          {loading ? (
            <div style={{ padding: "40px 16px", textAlign: "center", color: "#9b8888" }}>Loading predictions...</div>
          ) : error ? (
            <div style={{ padding: "40px 16px", textAlign: "center", color: "#dc2626" }}>{error}</div>
          ) : predictions.length === 0 ? (
            <div style={{ padding: "40px 16px", textAlign: "center", color: "#9b8888" }}>No predictions yet</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#f6f4f4" }}>
                  <tr>
                    <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#4a3030", borderBottom: "1px solid #e8e2e2" }}>User</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#4a3030", borderBottom: "1px solid #e8e2e2" }}>Location</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#4a3030", borderBottom: "1px solid #e8e2e2" }}>Property</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#4a3030", borderBottom: "1px solid #e8e2e2" }}>Details</th>
                    <th style={{ textAlign: "right", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#4a3030", borderBottom: "1px solid #e8e2e2" }}>Predicted Value</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#4a3030", borderBottom: "1px solid #e8e2e2" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(filter === "All" ? predictions : predictions.filter(p => p.predictionInput?.property_type === filter)).map((pred, idx) => (
                    <tr key={pred._id} style={{ borderBottom: "1px solid #e8e2e2", background: idx % 2 === 0 ? "#fff" : "#fdf6f6" }}>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#1c1212", fontWeight: 600 }}>
                        {pred.userId?.fullName || "N/A"}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#4a3030" }}>
                        <div>{pred.predictionInput?.city}</div>
                        <div style={{ fontSize: 10, color: "#9b8888" }}>{pred.predictionInput?.district}</div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#1c1212", fontWeight: 600 }}>
                        {pred.predictionInput?.property_type}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 11, color: "#4a3030" }}>
                        <div>{pred.predictionInput?.bedrooms} bed • {pred.predictionInput?.bathrooms} bath</div>
                        <div style={{ color: "#9b8888" }}>{pred.predictionInput?.house_size_sqm} sqm • {pred.predictionInput?.area_type}</div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#b91c1c", textAlign: "right" }}>
                        {formatLKR(pred.predictedPrice)}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#9b8888" }}>
                        {formatDate(pred.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}