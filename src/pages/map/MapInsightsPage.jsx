const locations = [
  { city:"Colombo",  count:423, pct:92, lat:6.9271, lng:79.8612, intensity:"high", trend:"11.3"   },
  { city:"Nugegoda", count:218, pct:47, lat:6.8728, lng:79.8883, intensity:"medium", trend:"8.6" },
  { city:"Kandy",    count:176, pct:38, lat:7.2906, lng:80.6337, intensity:"medium", trend:"7.4" },
  { city:"Galle",    count:134, pct:29, lat:6.0535, lng:80.2210, intensity:"low", trend:"5.9"    },
  { city:"Negombo",  count:98,  pct:21, lat:7.2086, lng:79.8358, intensity:"low", trend:"4.7"    },
  { city:"Moratuwa", count:87,  pct:18, lat:6.7730, lng:79.8816, intensity:"low", trend:"3.8"    },
];

const COLOR = { high:"#b91c1c", medium:"#d97706", low:"#1d4ed8" };
const BG    = { high:"#fee2e2", medium:"#fef3c7", low:"#dbeafe" };

export default function MapInsightsPage() {
  const total = locations.reduce((a,l)=>a+l.count,0);
  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, minWidth:0, height:"100%", overflow:"hidden" }}>
      <div style={{ flexShrink:0, background:"#fff", borderBottom:"1px solid #e8e2e2", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <p style={{ fontSize:16, fontWeight:700, color:"#1c1212", margin:0 }}>Map Insights</p>
          <p style={{ fontSize:12, color:"#9b8888", margin:"2px 0 0" }}>Geographic distribution of property predictions across Sri Lanka</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={{ background:"#fff", color:"#4a3030", border:"1px solid #e8e2e2", borderRadius:8, padding:"9px 16px", fontFamily:"inherit", fontSize:13, fontWeight:600, cursor:"pointer" }}>Filter Region</button>
          <button style={{ background:"#b91c1c", color:"#fff", border:"none", borderRadius:8, padding:"9px 16px", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer" }}>Export Map</button>
        </div>
      </div>

      <div style={{ flex:1, minHeight:0, overflowY:"auto", padding:"16px 24px 24px" }}>
        {/* Map placeholder */}
        <div style={{ background:"#fff", border:"1px solid #e8e2e2", borderRadius:12, padding:20, marginBottom:14, position:"relative" }}>
          <div style={{ height:280, background:"linear-gradient(135deg,#fdf6f6 0%,#f6f0f0 100%)", borderRadius:10, border:"1px solid #f0eaea", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
            {/* Dots */}
            {locations.map((l,i)=>(
              <div key={i} style={{ position:"absolute", top:`${50+(7.5-l.lat)*55}%`, left:`${50+(l.lng-80.5)*75}%`, transform:"translate(-50%,-50%)", zIndex:2 }}>
                <div style={{ width:14, height:14, borderRadius:"50%", background:COLOR[l.intensity], boxShadow:`0 0 0 8px ${COLOR[l.intensity]}22`, cursor:"pointer", position:"relative" }}>
                  <div style={{ position:"absolute", bottom:"130%", left:"50%", transform:"translateX(-50%)", background:"#1c1212", color:"#fff", borderRadius:6, padding:"4px 8px", fontSize:10, whiteSpace:"nowrap", fontWeight:600 }}>
                    {l.city}: {l.count}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ textAlign:"center" }}>
              <span style={{ fontSize:40 }}>🗺️</span>
              <p style={{ fontSize:12, color:"#9b8888", margin:"8px 0 0", maxWidth:260 }}>Integrate Google Maps or Leaflet.js for interactive map</p>
            </div>
          </div>
          {/* Legend */}
          <div style={{ position:"absolute", top:30, right:30, background:"#fff", border:"1px solid #e8e2e2", borderRadius:10, padding:"12px 16px" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"#9b8888", textTransform:"uppercase", letterSpacing:"0.4px", margin:"0 0 8px" }}>Density</p>
            {[["High (300+)","high"],["Medium (100–299)","medium"],["Low (<100)","low"]].map(([l,k])=>(
              <div key={k} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:COLOR[k], flexShrink:0 }} />
                <span style={{ fontSize:12, color:"#4a3030" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background:"#fff", border:"1px solid #e8e2e2", borderRadius:12, overflow:"hidden" }}>
          <div style={{ padding:"16px 20px 12px" }}>
            <p style={{ fontSize:14, fontWeight:700, color:"#1c1212", margin:0 }}>Predictions by Location</p>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:"#faf7f7", borderBottom:"1px solid #e8e2e2" }}>
                {["City","Predictions","Share","Intensity","Trend"].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"10px 16px", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color:"#9b8888" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {locations.map((l,i)=>{
                const pct = ((l.count/total)*100).toFixed(1);
                return (
                  <tr key={i} style={{ borderBottom:"1px solid #f0eaea" }}>
                    <td style={{ padding:"12px 16px", fontWeight:600 }}>{l.city}</td>
                    <td style={{ padding:"12px 16px" }}>{l.count}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:80, height:4, background:"#f0eaea", borderRadius:99, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:COLOR[l.intensity], borderRadius:99 }} />
                        </div>
                        <span style={{ fontSize:12, color:"#9b8888" }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:99, background:BG[l.intensity], color:COLOR[l.intensity] }}>
                        {l.intensity.charAt(0).toUpperCase()+l.intensity.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ color:"#16a34a", fontWeight:700, fontSize:12 }}>▲ +{l.trend}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}