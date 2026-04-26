import { useState } from "react";

const sections = [
  { id:"general",       title:"General",       icon:"◐" },
  { id:"notifications", title:"Notifications", icon:"◎" },
  { id:"security",      title:"Security",      icon:"◉" },
];

const generalFields = [
  { label:"Site Name",        type:"text",     val:"PropPredict Admin" },
  { label:"Contact Email",    type:"email",    val:"admin@proppredict.lk" },
  { label:"Default Currency", type:"select",   opts:["USD ($)","LKR (Rs)","EUR (€)"],               val:"USD ($)" },
  { label:"Timezone",         type:"select",   opts:["Asia/Colombo (IST)","UTC","America/New_York"], val:"Asia/Colombo (IST)" },
];

const notifToggles = [
  { label:"Email on new user registration", on:true  },
  { label:"Alert on suspended accounts",    on:true  },
  { label:"Weekly summary digest",          on:false },
  { label:"New prediction submitted",       on:false },
];

const securityFields = [
  { label:"Current Password", type:"password" },
  { label:"New Password",     type:"password" },
  { label:"Confirm Password", type:"password" },
];

function Toggle({ on, onChange }) {
  return (
    <div onClick={()=>onChange(!on)} style={{ width:40, height:22, borderRadius:99, cursor:"pointer", background:on?"#b91c1c":"#e8e2e2", position:"relative", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left:on?20:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .15s", boxShadow:"0 1px 3px rgba(0,0,0,.2)" }} />
    </div>
  );
}

export default function SettingsPage() {
  const [active, setActive] = useState("general");
  const [toggles, setToggles] = useState(notifToggles.map(t=>t.on));

  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, minWidth:0, height:"100%", overflow:"hidden" }}>
      <div style={{ flexShrink:0, background:"#fff", borderBottom:"1px solid #e8e2e2", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <p style={{ fontSize:16, fontWeight:700, color:"#1c1212", margin:0 }}>Settings</p>
          <p style={{ fontSize:12, color:"#9b8888", margin:"2px 0 0" }}>Configure your admin portal preferences</p>
        </div>
        <button style={{ background:"#b91c1c", color:"#fff", border:"none", borderRadius:8, padding:"9px 16px", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer" }}>Save Changes</button>
      </div>

      <div style={{ flex:1, minHeight:0, overflowY:"auto" }}>
        <div style={{ display:"flex", gap:16, padding:"16px 24px 24px" }}>

          {/* Sidebar tabs */}
          <div style={{ width:180, flexShrink:0, display:"flex", flexDirection:"column", gap:2 }}>
            {sections.map(s=>(
              <button key={s.id} onClick={()=>setActive(s.id)} style={{
                display:"flex", alignItems:"center", gap:8, padding:"9px 12px", borderRadius:7,
                border: active===s.id?"1px solid #fca5a5":"none",
                background: active===s.id?"#fff":"none",
                fontFamily:"inherit", fontSize:13, fontWeight: active===s.id?700:500,
                cursor:"pointer", color: active===s.id?"#b91c1c":"#9b8888", textAlign:"left", width:"100%",
              }}><span>{s.icon}</span>{s.title}</button>
            ))}
            <div style={{ flex:1, minHeight:20 }} />
            <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:14, marginTop:16 }}>
              <p style={{ fontSize:11, fontWeight:700, color:"#b91c1c", textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 8px" }}>Danger Zone</p>
              {["Delete All Data","Reset System"].map(l=>(
                <button key={l} style={{ display:"block", width:"100%", marginBottom:6, fontFamily:"inherit", fontSize:12, fontWeight:600, color:"#dc2626", background:"none", border:"1px solid #fca5a5", borderRadius:6, padding:"6px 10px", cursor:"pointer", textAlign:"left" }}>{l}</button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:"#fff", border:"1px solid #e8e2e2", borderRadius:12, padding:"20px 24px" }}>
              <p style={{ fontSize:14, fontWeight:700, color:"#1c1212", margin:"0 0 18px" }}>
                {sections.find(s=>s.id===active)?.title} Settings
              </p>

              {active==="general" && (
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  {generalFields.map((f,i)=>(
                    <div key={i}>
                      <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#4a3030", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:6 }}>{f.label}</label>
                      {f.type==="select"
                        ? <select defaultValue={f.val} style={{ width:"100%", border:"1px solid #e8e2e2", borderRadius:8, padding:"9px 13px", fontFamily:"inherit", fontSize:13, background:"#fdf9f9", outline:"none" }}>
                            {f.opts.map(o=><option key={o}>{o}</option>)}
                          </select>
                        : <input type={f.type} defaultValue={f.val} style={{ width:"100%", border:"1px solid #e8e2e2", borderRadius:8, padding:"9px 13px", fontFamily:"inherit", fontSize:13, background:"#fdf9f9", outline:"none" }} />
                      }
                    </div>
                  ))}
                </div>
              )}

              {active==="notifications" && (
                <div>
                  {notifToggles.map((t,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:i<notifToggles.length-1?"1px solid #f0eaea":"none" }}>
                      <div>
                        <p style={{ fontSize:14, fontWeight:600, color:"#1c1212", margin:0 }}>{t.label}</p>
                        <p style={{ fontSize:12, color:"#9b8888", margin:"3px 0 0" }}>{toggles[i]?"Enabled":"Disabled"}</p>
                      </div>
                      <Toggle on={toggles[i]} onChange={v=>setToggles(prev=>{const n=[...prev];n[i]=v;return n;})} />
                    </div>
                  ))}
                </div>
              )}

              {active==="security" && (
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  {securityFields.map((f,i)=>(
                    <div key={i}>
                      <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#4a3030", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:6 }}>{f.label}</label>
                      <input type="password" placeholder="••••••••" style={{ width:"100%", border:"1px solid #e8e2e2", borderRadius:8, padding:"9px 13px", fontFamily:"inherit", fontSize:13, background:"#fdf9f9", outline:"none" }} />
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop:22, display:"flex", gap:10 }}>
                <button style={{ background:"#b91c1c", color:"#fff", border:"none", borderRadius:8, padding:"9px 20px", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer" }}>Save Changes</button>
                <button style={{ background:"#fff", color:"#4a3030", border:"1px solid #e8e2e2", borderRadius:8, padding:"9px 16px", fontFamily:"inherit", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
              </div>
            </div>

            {/* System info */}
            <div style={{ background:"#fff", border:"1px solid #e8e2e2", borderRadius:12, padding:"18px 24px" }}>
              <p style={{ fontSize:14, fontWeight:700, color:"#1c1212", margin:"0 0 14px" }}>System Information</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[["Version","v2.4.1"],["Environment","Production"],["Last Backup","Mar 12, 2024"],["DB Status","Healthy ✓"]].map(([l,v],i)=>(
                  <div key={i} style={{ background:"#faf7f7", border:"1px solid #f0eaea", borderRadius:8, padding:"12px 14px" }}>
                    <p style={{ fontSize:11, fontWeight:700, color:"#9b8888", textTransform:"uppercase", letterSpacing:"0.4px", margin:"0 0 4px" }}>{l}</p>
                    <p style={{ fontSize:14, fontWeight:600, color:"#1c1212", margin:0 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}