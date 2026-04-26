import { useState } from "react";

const reports = [
  { name:"Monthly Predictions Report",  type:"PDF",   period:"March 2024",    size:"2.4 MB", typeColor:"#dc2626" },
  { name:"User Activity Summary",        type:"Excel", period:"March 2024",    size:"1.5 MB", typeColor:"#16a34a" },
  { name:"Property Valuation Trends",   type:"CSV",   period:"February 2024", size:"3.1 MB", typeColor:"#1d4ed8" },
  { name:"System Performance Report",   type:"PDF",   period:"February 2024", size:"1.2 MB", typeColor:"#dc2626" },
  { name:"Market Analysis Q1 2024",     type:"Excel", period:"January 2024",  size:"4.7 MB", typeColor:"#16a34a" },
  { name:"Accuracy Metrics Report",     type:"CSV",   period:"January 2024",  size:"2.9 MB", typeColor:"#1d4ed8" },
];

const exports = [
  { title:"Prediction Data",   desc:"All property valuations and accuracy metrics", icon:"📊", btns:[{l:"Export CSV",bg:"#16a34a",c:"#fff"},{l:"Export PDF",bg:"#fff",c:"#b91c1c",br:"1px solid #fca5a5"}] },
  { title:"User Activity",     desc:"Login events, predictions made, upgrades",     icon:"👥", btns:[{l:"Export CSV",bg:"#1d4ed8",c:"#fff"},{l:"Export Excel",bg:"#fff",c:"#b91c1c",br:"1px solid #fca5a5"}] },
  { title:"Property Analytics",desc:"Location trends, price distributions",         icon:"🗺️", btns:[{l:"Export CSV",bg:"#7c3aed",c:"#fff"},{l:"Export PDF",bg:"#fff",c:"#b91c1c",br:"1px solid #fca5a5"}] },
];

const stats = [
  { value:"1,247", label:"Total Predictions", color:"#b91c1c" },
  { value:"342",   label:"Total Users",       color:"#1e40af" },
  { value:"$485K", label:"Avg Price",         color:"#16a34a" },
  { value:"Colombo",label:"Top Location",    color:"#b91c1c" },
  { value:"94.2%", label:"Accuracy Rate",    color:"#16a34a" },
];

export default function ReportsPage() {
  const [from,setFrom] = useState(""); const [to,setTo] = useState("");
  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, minWidth:0, height:"100%", overflow:"hidden" }}>
      <div style={{ flexShrink:0, background:"#fff", borderBottom:"1px solid #e8e2e2", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <p style={{ fontSize:16, fontWeight:700, color:"#1c1212", margin:0 }}>Reports & Exports</p>
          <p style={{ fontSize:12, color:"#9b8888", margin:"2px 0 0" }}>Generate, filter, and download system reports</p>
        </div>
        <button style={{ background:"#b91c1c", color:"#fff", border:"none", borderRadius:8, padding:"9px 16px", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer" }}>⬇ Bulk Export</button>
      </div>

      <div style={{ flex:1, minHeight:0, overflowY:"auto" }}>
        {/* Stats strip */}
        <div style={{ display:"flex", background:"#fff", borderBottom:"1px solid #e8e2e2", padding:"12px 24px", gap:0 }}>
          {stats.map((s,i) => (
            <div key={i} style={{ flex:1, textAlign:"center", borderRight: i<stats.length-1?"1px solid #f0eaea":"none", padding:"0 8px" }}>
              <p style={{ fontSize:17, fontWeight:700, color:s.color, margin:0 }}>{s.value}</p>
              <p style={{ fontSize:10, color:"#9b8888", margin:"2px 0 0", textTransform:"uppercase", letterSpacing:"0.4px" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, padding:"16px 24px 24px" }}>
          {/* Left */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:"#fff", border:"1px solid #e8e2e2", borderRadius:12, padding:"18px 20px" }}>
              <p style={{ fontSize:14, fontWeight:700, color:"#1c1212", margin:"0 0 12px" }}>Date Range Filter</p>
              <div style={{ display:"flex", gap:12 }}>
                {[["From",from,setFrom],["To",to,setTo]].map(([l,v,s],i)=>(
                  <div key={i} style={{ flex:1 }}>
                    <label style={{ fontSize:11, fontWeight:700, color:"#9b8888", textTransform:"uppercase", letterSpacing:"0.4px", display:"block", marginBottom:5 }}>{l}</label>
                    <input type="date" value={v} onChange={e=>s(e.target.value)} style={{ width:"100%", border:"1px solid #e8e2e2", borderRadius:7, padding:"8px 12px", fontFamily:"inherit", fontSize:13, outline:"none" }} />
                  </div>
                ))}
              </div>
              <button style={{ width:"100%", marginTop:12, background:"#b91c1c", color:"#fff", border:"none", borderRadius:8, padding:"9px", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer" }}>Apply Filter</button>
            </div>
            {exports.map((ex,i)=>(
              <div key={i} style={{ background:"#fff", border:"1px solid #e8e2e2", borderRadius:12, padding:"16px 18px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:12 }}>
                  <span style={{ fontSize:20 }}>{ex.icon}</span>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:"#1c1212", margin:0 }}>{ex.title}</p>
                    <p style={{ fontSize:12, color:"#9b8888", margin:"3px 0 0" }}>{ex.desc}</p>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  {ex.btns.map((b,j)=>(
                    <button key={j} style={{ flex:1, background:b.bg, color:b.c, border:b.br||"none", borderRadius:7, padding:"8px 0", fontFamily:"inherit", fontSize:12, fontWeight:700, cursor:"pointer" }}>{b.l}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right */}
          <div style={{ background:"#fff", border:"1px solid #e8e2e2", borderRadius:12, padding:"18px 20px" }}>
            <p style={{ fontSize:14, fontWeight:700, color:"#1c1212", margin:"0 0 14px" }}>Recent Reports</p>
            {reports.map((r,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:i<reports.length-1?"1px solid #f0eaea":"none" }}>
                <div style={{ width:36, height:36, borderRadius:8, background:r.typeColor+"18", color:r.typeColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                  {r.type==="PDF"?"📄":r.type==="Excel"?"📊":"📋"}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:"#1c1212", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.name}</p>
                  <p style={{ fontSize:11, color:"#9b8888", margin:"2px 0 0" }}>{r.period} · {r.size}</p>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
                  <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99, background:r.typeColor+"18", color:r.typeColor }}>{r.type}</span>
                  <button style={{ fontSize:12, background:"none", border:"1px solid #e8e2e2", borderRadius:6, cursor:"pointer", padding:"3px 7px", color:"#b91c1c", fontFamily:"inherit" }}>⬇</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}