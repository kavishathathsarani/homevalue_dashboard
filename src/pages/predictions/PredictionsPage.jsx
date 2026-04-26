import { useState } from "react";

const properties = [
  { id:1, initials:"COL", address:"45 Galle Road, Colombo 03",       type:"Apartment", beds:3, baths:2, sqft:1450, predicted:"$320,000", actual:"$315,000", accuracy:98.4, status:"sold",    date:"Feb 10, 2024", user:"John Doe"     },
  { id:2, initials:"NUG", address:"12 Park Avenue, Nugegoda",         type:"House",     beds:4, baths:3, sqft:2200, predicted:"$485,000", actual:null,       accuracy:null,  status:"pending", date:"Mar 5, 2024",  user:"Ava Perera"   },
  { id:3, initials:"KDY", address:"88 Temple Road, Kandy",            type:"Villa",     beds:5, baths:4, sqft:3100, predicted:"$720,000", actual:"$705,000", accuracy:97.9,  status:"sold",    date:"Jan 22, 2024", user:"Michael Brown"},
  { id:4, initials:"NEG", address:"7 Beach Road, Negombo",            type:"House",     beds:3, baths:2, sqft:1800, predicted:"$260,000", actual:"$268,000", accuracy:97.0,  status:"sold",    date:"Dec 14, 2023", user:"Sarah Wilson" },
  { id:5, initials:"MAH", address:"33 High Level Rd, Maharagama",     type:"Apartment", beds:2, baths:1, sqft:950,  predicted:"$155,000", actual:null,       accuracy:null,  status:"pending", date:"Mar 12, 2024", user:"David Lee"    },
  { id:6, initials:"GAL", address:"22 Lighthouse St, Galle",          type:"Villa",     beds:4, baths:3, sqft:2600, predicted:"$390,000", actual:"$385,000", accuracy:98.7,  status:"sold",    date:"Jan 5, 2024",  user:"Rajan Kumar"  },
];

const STATUS_STYLE = {
  sold:    { bg:"#dcfce7", color:"#166534" },
  pending: { bg:"#fef3c7", color:"#92400e" },
};

export default function PredictionsPage() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? properties : properties.filter(p => p.status === filter.toLowerCase());

  const stats = [
    { label:"Total Properties", value:properties.length,                              color:"#b91c1c" },
    { label:"Pending Sales",    value:properties.filter(p=>p.status==="pending").length, color:"#d97706" },
    { label:"Sold Properties",  value:properties.filter(p=>p.status==="sold").length,   color:"#16a34a" },
    { label:"Avg Accuracy",     value:"97.8%",                                         color:"#b91c1c" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, minWidth:0, height:"100%", overflow:"hidden" }}>

      <div style={{ flexShrink:0, background:"#fff", borderBottom:"1px solid #e8e2e2", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <p style={{ fontSize:16, fontWeight:700, color:"#1c1212", margin:0 }}>Predictions</p>
          <p style={{ fontSize:12, color:"#9b8888", margin:"2px 0 0" }}>AI-powered property valuation records</p>
        </div>
        <button style={{ background:"#b91c1c", color:"#fff", border:"none", borderRadius:8, padding:"9px 16px", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Add Property</button>
      </div>

      <div style={{ flex:1, minHeight:0, overflowY:"auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, padding:"18px 24px 0" }}>
          {stats.map((s,i) => (
            <div key={i} style={{ background:"#fff", border:"1px solid #e8e2e2", borderRadius:10, padding:"15px 16px" }}>
              <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color:"#9b8888", margin:"0 0 5px" }}>{s.label}</p>
              <p style={{ fontSize:24, fontWeight:700, color:s.color, margin:0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"14px 24px 10px" }}>
          {["All","Pending","Sold"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontFamily:"inherit", fontSize:12, fontWeight:600, cursor:"pointer",
              padding:"5px 13px", borderRadius:6, border:"1px solid",
              borderColor: filter===f?"#b91c1c":"#e8e2e2",
              background: filter===f?"#b91c1c":"#fff",
              color: filter===f?"#fff":"#9b8888",
            }}>{f}</button>
          ))}
          <div style={{ flex:1 }} />
          <span style={{ fontSize:12, color:"#9b8888" }}>{filtered.length} results</span>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, padding:"0 24px 24px" }}>
          {filtered.map(p => {
            const sc = STATUS_STYLE[p.status];
            return (
              <div key={p.id} style={{ background:"#fff", border:"1px solid #e8e2e2", borderRadius:12, overflow:"hidden" }}>
                <div style={{ background:"#fdf6f6", height:80, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                  <span style={{ fontSize:32 }}>🏠</span>
                  <span style={{ position:"absolute", top:10, right:10, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:99, background:sc.bg, color:sc.color }}>
                    {p.status.charAt(0).toUpperCase()+p.status.slice(1)}
                  </span>
                </div>
                <div style={{ padding:"14px 16px" }}>
                  <p style={{ fontSize:11, fontWeight:700, color:"#b91c1c", textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 4px" }}>{p.type} · {p.sqft.toLocaleString()} sqft</p>
                  <p style={{ fontSize:13, fontWeight:600, color:"#1c1212", margin:"0 0 10px", lineHeight:1.4 }}>{p.address}</p>
                  <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                    {[`🛏 ${p.beds} beds`, `🚿 ${p.baths} baths`].map(c => (
                      <span key={c} style={{ fontSize:11, background:"#f6f4f4", padding:"3px 8px", borderRadius:6, color:"#4a3030" }}>{c}</span>
                    ))}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                    <div>
                      <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color:"#9b8888", margin:"0 0 2px" }}>Predicted</p>
                      <p style={{ fontSize:15, fontWeight:700, color:"#1c1212", margin:0 }}>{p.predicted}</p>
                    </div>
                    {p.actual && (
                      <div style={{ textAlign:"right" }}>
                        <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color:"#9b8888", margin:"0 0 2px" }}>Actual</p>
                        <p style={{ fontSize:15, fontWeight:700, color:"#16a34a", margin:0 }}>{p.actual}</p>
                      </div>
                    )}
                  </div>
                  {p.accuracy && (
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                      <span style={{ fontSize:11, color:"#9b8888", flexShrink:0 }}>Accuracy</span>
                      <div style={{ flex:1, height:3, background:"#f0eaea", borderRadius:99, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${p.accuracy}%`, background:"#16a34a", borderRadius:99 }} />
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:"#16a34a", flexShrink:0 }}>{p.accuracy}%</span>
                    </div>
                  )}
                  <div style={{ display:"flex", justifyContent:"space-between", borderTop:"1px solid #f0eaea", paddingTop:10, marginBottom:10 }}>
                    <span style={{ fontSize:11, color:"#9b8888" }}>👤 {p.user}</span>
                    <span style={{ fontSize:11, color:"#9b8888" }}>{p.date}</span>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button style={{ flex:1, background:"#b91c1c", color:"#fff", border:"none", borderRadius:7, padding:"8px", fontFamily:"inherit", fontSize:12, fontWeight:700, cursor:"pointer" }}>View Details</button>
                    <button style={{ background:"#fff", color:"#4a3030", border:"1px solid #e8e2e2", borderRadius:7, padding:"8px 12px", fontFamily:"inherit", fontSize:12, fontWeight:600, cursor:"pointer" }}>Edit</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}