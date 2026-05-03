import { useEffect, useMemo, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const fmtLKR = (value) =>
  new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const fmtDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function ReportsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [reportLog, setReportLog] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllPredictions = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${BACKEND_URL}/api/predictions/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to load prediction reports");
        }

        const data = await res.json();
        setPredictions(data.data || []);
      } catch (err) {
        setError(err.message || "Unable to fetch report data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllPredictions();
  }, [token]);

  const filteredPredictions = useMemo(() => {
    return predictions.filter((p) => {
      const created = new Date(p.createdAt);
      const fromOk = from ? created >= new Date(from) : true;
      const toOk = to
        ? created <= new Date(`${to}T23:59:59`)
        : true;
      return fromOk && toOk;
    });
  }, [predictions, from, to]);

  const metrics = useMemo(() => {
    const totalPredictions = filteredPredictions.length;
    const totalValue = filteredPredictions.reduce((sum, p) => sum + (p.predictedPrice || 0), 0);
    const avgValue = totalPredictions ? totalValue / totalPredictions : 0;
    const uniqueUsers = new Set(filteredPredictions.map((p) => p.userId?._id).filter(Boolean)).size;

    const districtCounts = {};
    filteredPredictions.forEach((p) => {
      const district = p.predictionInput?.district || "Unknown";
      districtCounts[district] = (districtCounts[district] || 0) + 1;
    });

    const topDistrict =
      Object.entries(districtCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const typeCounts = {};
    filteredPredictions.forEach((p) => {
      const type = p.predictionInput?.property_type || "Unknown";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return {
      totalPredictions,
      totalValue,
      avgValue,
      uniqueUsers,
      topDistrict,
      typeCounts,
    };
  }, [filteredPredictions]);

  const downloadCSV = () => {
    const headers = [
      "Date",
      "User",
      "Email",
      "District",
      "City",
      "Property Type",
      "Area Type",
      "Bedrooms",
      "Bathrooms",
      "House Size sqm",
      "Land Size perch",
      "Predicted Price LKR",
    ];

    const rows = filteredPredictions.map((p) => [
      fmtDate(p.createdAt),
      p.userId?.fullName || "",
      p.userId?.email || "",
      p.predictionInput?.district || "",
      p.predictionInput?.city || "",
      p.predictionInput?.property_type || "",
      p.predictionInput?.area_type || "",
      p.predictionInput?.bedrooms || "",
      p.predictionInput?.bathrooms || "",
      p.predictionInput?.house_size_sqm || "",
      p.predictionInput?.land_size_perch || "",
      p.predictedPrice || 0,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `prediction-report-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    setReportLog((prev) => [
      {
        id: Date.now(),
        name: "Prediction Data Export",
        format: "CSV",
        generatedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(filteredPredictions, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `prediction-report-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);

    setReportLog((prev) => [
      {
        id: Date.now(),
        name: "Prediction Data Export",
        format: "JSON",
        generatedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const printSummary = () => {
    window.print();
    setReportLog((prev) => [
      {
        id: Date.now(),
        name: "Executive Summary",
        format: "PRINT",
        generatedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, height: "100%", overflow: "hidden" }}>
      <div style={{ flexShrink: 0, background: "#fff", borderBottom: "1px solid #e8e2e2", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1c1212", margin: 0 }}>Reports & Exports</p>
          <p style={{ fontSize: 12, color: "#9b8888", margin: "2px 0 0" }}>Comprehensive reporting for all prediction history</p>
        </div>
        <button onClick={downloadCSV} style={{ background: "#b91c1c", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          ⬇ Export Current CSV
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 24px 24px" }}>
        {loading && <div style={{ padding: "24px", background: "#fff", borderRadius: 12, border: "1px solid #e8e2e2", color: "#9b8888" }}>Loading reports...</div>}
        {error && <div style={{ padding: "24px", background: "#fff", borderRadius: 12, border: "1px solid #fca5a5", color: "#b91c1c" }}>{error}</div>}

        {!loading && !error && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(120px, 1fr))", gap: 12, marginBottom: 14 }}>
              {[
                { label: "Total Predictions", value: metrics.totalPredictions, color: "#b91c1c" },
                { label: "Total Value", value: fmtLKR(metrics.totalValue), color: "#16a34a" },
                { label: "Average Value", value: fmtLKR(metrics.avgValue), color: "#1d4ed8" },
                { label: "Active Users", value: metrics.uniqueUsers, color: "#7c3aed" },
                { label: "Top District", value: metrics.topDistrict, color: "#b45309" },
              ].map((s) => (
                <div key={s.label} style={{ background: "#fff", border: "1px solid #e8e2e2", borderRadius: 10, padding: "14px 12px" }}>
                  <p style={{ margin: 0, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.5px", color: "#9b8888", fontWeight: 700 }}>{s.label}</p>
                  <p style={{ margin: "6px 0 0", fontSize: 18, color: s.color, fontWeight: 700 }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: 14, marginBottom: 14 }}>
              <div style={{ background: "#fff", border: "1px solid #e8e2e2", borderRadius: 12, padding: "16px" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1c1212", margin: "0 0 12px" }}>Date Range</p>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#9b8888", textTransform: "uppercase", letterSpacing: "0.4px", display: "block", marginBottom: 4 }}>From</label>
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={{ width: "100%", border: "1px solid #e8e2e2", borderRadius: 7, padding: "8px 10px", fontFamily: "inherit", fontSize: 12, outline: "none" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#9b8888", textTransform: "uppercase", letterSpacing: "0.4px", display: "block", marginBottom: 4 }}>To</label>
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={{ width: "100%", border: "1px solid #e8e2e2", borderRadius: 7, padding: "8px 10px", fontFamily: "inherit", fontSize: 12, outline: "none" }} />
                  </div>
                </div>
                <button onClick={() => { setFrom(""); setTo(""); }} style={{ width: "100%", background: "#fff", color: "#b91c1c", border: "1px solid #fca5a5", borderRadius: 8, padding: "8px 10px", fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  Reset Filter
                </button>
              </div>

              <div style={{ background: "#fff", border: "1px solid #e8e2e2", borderRadius: 12, padding: "16px" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1c1212", margin: "0 0 12px" }}>Report Actions</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  <button onClick={downloadCSV} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, padding: "9px", fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Export CSV</button>
                  <button onClick={downloadJSON} style={{ background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, padding: "9px", fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Export JSON</button>
                  <button onClick={printSummary} style={{ background: "#fff", color: "#b91c1c", border: "1px solid #fca5a5", borderRadius: 8, padding: "9px", fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Print Summary</button>
                </div>
                <p style={{ fontSize: 11, color: "#9b8888", margin: "10px 0 0" }}>{filteredPredictions.length} predictions in current report scope</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: 14 }}>
              <div style={{ background: "#fff", border: "1px solid #e8e2e2", borderRadius: 12, padding: "16px" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1c1212", margin: "0 0 12px" }}>Type Distribution</p>
                {Object.keys(metrics.typeCounts).length === 0 && (
                  <p style={{ margin: 0, fontSize: 12, color: "#9b8888" }}>No data for selected dates.</p>
                )}
                {Object.entries(metrics.typeCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => {
                    const pct = metrics.totalPredictions ? Math.round((count / metrics.totalPredictions) * 100) : 0;
                    return (
                      <div key={type} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4a3030", marginBottom: 4 }}>
                          <span>{type}</span>
                          <span>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height: 6, background: "#f0eaea", borderRadius: 999 }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "#b91c1c", borderRadius: 999 }} />
                        </div>
                      </div>
                    );
                  })}

                <p style={{ fontSize: 14, fontWeight: 700, color: "#1c1212", margin: "16px 0 10px" }}>Recent Report Activity</p>
                {reportLog.length === 0 && <p style={{ margin: 0, fontSize: 12, color: "#9b8888" }}>No exports generated yet.</p>}
                {reportLog.slice(0, 6).map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f0eaea", padding: "8px 0" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 12, color: "#1c1212", fontWeight: 600 }}>{item.name}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 10, color: "#9b8888" }}>{fmtDate(item.generatedAt)}</p>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#b91c1c", background: "#fee2e2", padding: "2px 6px", borderRadius: 999, height: "fit-content" }}>
                      {item.format}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", border: "1px solid #e8e2e2", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #e8e2e2" }}>
                  <p style={{ margin: 0, fontSize: 14, color: "#1c1212", fontWeight: 700 }}>Prediction History Report</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9b8888" }}>Detailed records for each prediction with user and parameters</p>
                </div>
                <div style={{ overflowX: "auto", maxHeight: 520 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ position: "sticky", top: 0, background: "#f8f5f5" }}>
                      <tr>
                        <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, color: "#4a3030" }}>Date</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, color: "#4a3030" }}>User</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, color: "#4a3030" }}>Location</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, color: "#4a3030" }}>Parameters</th>
                        <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 11, color: "#4a3030" }}>Predicted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPredictions.map((p, idx) => (
                        <tr key={p._id || idx} style={{ borderTop: "1px solid #f0eaea", background: idx % 2 ? "#fff" : "#fdf9f9" }}>
                          <td style={{ padding: "10px 12px", fontSize: 11, color: "#6b4a4a" }}>{fmtDate(p.createdAt)}</td>
                          <td style={{ padding: "10px 12px", fontSize: 12, color: "#1c1212", fontWeight: 600 }}>{p.userId?.fullName || "Unknown"}</td>
                          <td style={{ padding: "10px 12px", fontSize: 11, color: "#4a3030" }}>
                            <div>{p.predictionInput?.city || "N/A"}</div>
                            <div style={{ color: "#9b8888" }}>{p.predictionInput?.district || "N/A"}</div>
                          </td>
                          <td style={{ padding: "10px 12px", fontSize: 11, color: "#4a3030" }}>
                            <div>{p.predictionInput?.property_type || "N/A"} • {p.predictionInput?.area_type || "N/A"}</div>
                            <div style={{ color: "#9b8888" }}>
                              {p.predictionInput?.bedrooms || 0} bed • {p.predictionInput?.bathrooms || 0} bath • {p.predictionInput?.house_size_sqm || 0} sqm
                            </div>
                          </td>
                          <td style={{ padding: "10px 12px", fontSize: 12, color: "#b91c1c", textAlign: "right", fontWeight: 700 }}>{fmtLKR(p.predictedPrice)}</td>
                        </tr>
                      ))}
                      {filteredPredictions.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ padding: 24, textAlign: "center", fontSize: 12, color: "#9b8888" }}>
                            No prediction records for selected date range.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}