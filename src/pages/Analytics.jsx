import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import "./Dashboard.css";

const CATS = ["General", "Work", "Study", "Personal"];
const CAT_META = {
  General:  { color: "#4a9e9e", bg: "rgba(74,158,158,0.10)",  border: "rgba(74,158,158,0.25)",  icon: "📝" },
  Work:     { color: "#5a82b8", bg: "rgba(90,130,184,0.10)",  border: "rgba(90,130,184,0.25)",  icon: "💼" },
  Study:    { color: "#9e7a4a", bg: "rgba(158,122,74,0.10)",  border: "rgba(158,122,74,0.25)",  icon: "📚" },
  Personal: { color: "#9e4a7a", bg: "rgba(158,74,122,0.10)",  border: "rgba(158,74,122,0.25)",  icon: "🌟" },
};

function RingIndicator({ pct, color, size = 64 }) {
  const r    = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(150,170,190,0.18)" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1)" }}
      />
    </svg>
  );
}

export default function Analytics() {
  const navigate = useNavigate();
  const [notes,  setNotes]  = useState([]);
  const [theme,  setTheme]  = useState(
    () => localStorage.getItem("sb-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sb-theme", theme);
  }, [theme]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/notes");
        setNotes(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };

  const total    = notes.length;
  const pinned   = notes.filter(n => n.isPinned).length;
  const unpinned = total - pinned;
  const catCount = CATS.reduce((a, c) => ({ ...a, [c]: notes.filter(n => n.category === c).length }), {});

  // Tie-aware most used
  const maxVal  = Math.max(...Object.values(catCount), 0);
  const topCats = CATS.filter(c => catCount[c] === maxVal && maxVal > 0);
  const isTie   = topCats.length > 1;

  return (
    <div className="db-shell" data-theme={theme}>

      {/* ══ SIDEBAR ══ */}
      <aside className="db-sidebar">
        <div className="sb-brand" onClick={() => navigate("/dashboard")} style={{ cursor:"pointer" }}>
          <span className="sb-logo">🧠</span>
          <div>
            <span className="sb-name">Second Brain</span>
            <span className="sb-sub">Your digital memory</span>
          </div>
        </div>

        <nav className="sb-nav">
          <div className="sb-section-label">Menu</div>
          <button className="sb-link" onClick={() => navigate("/dashboard")}><span className="sb-icon">🏠</span> Dashboard</button>
          <button className="sb-link" onClick={() => navigate("/notes")}>
            <span className="sb-icon">📋</span> All Notes
            <span className="sb-badge">{total}</span>
          </button>
          <button className="sb-link active"><span className="sb-icon">📊</span> Analytics</button>

          <div className="sb-section-label">Categories</div>
          {CATS.map(cat => (
            <button key={cat} className="sb-cat-item" onClick={() => navigate("/notes")}>
              <span className="sb-cat-dot" style={{ background: CAT_META[cat].color }} />
              <span>{CAT_META[cat].icon} {cat}</span>
              <span className="sb-cat-count">{catCount[cat]}</span>
            </button>
          ))}

          <div className="sb-section-label">Account</div>
          <button className="sb-link" onClick={() => navigate("/profile")}><span className="sb-icon">👤</span> Profile</button>
          <button className="sb-link" onClick={() => navigate("/settings")}><span className="sb-icon">⚙️</span> Settings</button>
        </nav>

        <div className="sb-footer">
          <button className="sb-footer-btn theme-btn" onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
            <span className="sb-icon">{theme === "light" ? "🌙" : "☀️"}</span>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <button className="sb-footer-btn logout-btn" onClick={handleLogout}>
            <span className="sb-icon">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div className="db-main">
        <header className="db-topbar">
          <div className="topbar-left">
            <span className="topbar-title">Analytics</span>
            <span className="topbar-crumb">Second Brain / Analytics</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-avatar" onClick={() => navigate("/profile")} style={{ cursor:"pointer" }}>😊</div>
          </div>
        </header>

        <div className="db-body">
          <div className="page-head">
            <h1>📊 Analytics</h1>
            <div className="page-head-bar" />
          </div>

          {/* ── ROW 1: Hero stats ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:13, marginBottom:20 }}>
            {[
              { icon:"📋", value:total,    label:"Total Notes",        color:"#4a9e9e", hint:"All time" },
              { icon:"📌", value:pinned,   label:"Pinned",             color:"#7a7ab8", hint:`${total>0?Math.round(pinned/total*100):0}% of notes` },
              { icon:"✍️", value:unpinned, label:"Unpinned",           color:"#9e7a4a", hint:"Regular notes" },
              { icon:"📂", value:CATS.filter(c=>catCount[c]>0).length, label:"Active Categories", color:"#9e4a7a", hint:`of ${CATS.length} total` },
            ].map(({ icon, value, label, color, hint }) => (
              <div key={label} style={{
                background:"var(--card-bg)", border:"1px solid var(--card-border)",
                borderRadius:14, padding:"18px 18px 14px",
                boxShadow:"var(--card-shadow)", position:"relative", overflow:"hidden",
                transition:"transform 0.22s, box-shadow 0.22s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(30,60,90,0.13)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="var(--card-shadow)"; }}
              >
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:color }} />
                <div style={{ fontSize:20, marginBottom:10 }}>{icon}</div>
                <div style={{ fontSize:32, fontWeight:800, color:"var(--text-primary)", lineHeight:1, marginBottom:3 }}>{value}</div>
                <div style={{ fontSize:10, fontWeight:800, letterSpacing:"0.09em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:6 }}>{label}</div>
                <div style={{ fontSize:10.5, fontWeight:600, color, opacity:0.85 }}>{hint}</div>
              </div>
            ))}
          </div>

          {/* ── ROW 2: Category breakdown + Right cards ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:16, marginBottom:20, alignItems:"start" }}>

            {/* Left: Notes by Category */}
            <div style={{ background:"var(--card-bg)", border:"1px solid var(--card-border)", borderRadius:14, padding:"20px 22px", boxShadow:"var(--card-shadow)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, paddingBottom:14, borderBottom:"1px solid var(--card-border)" }}>
                <span style={{ fontSize:15 }}>📋</span>
                <span style={{ fontSize:14, fontWeight:800, color:"var(--text-primary)" }}>Notes by Category</span>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {CATS.map(cat => {
                  const count = catCount[cat];
                  const pct   = total > 0 ? Math.round(count / total * 100) : 0;
                  const barW  = total > 0 ? Math.round(count / total * 100) : 0;
                  const meta  = CAT_META[cat];
                  return (
                    <div key={cat} style={{ cursor:"pointer" }} onClick={() => navigate("/notes")}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                        <RingIndicator pct={pct} color={meta.color} size={48} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                            <span style={{ fontSize:13.5, fontWeight:700, color:"var(--text-primary)" }}>
                              {meta.icon} {cat}
                            </span>
                            <span style={{ fontSize:11.5, fontWeight:800, padding:"2px 9px", borderRadius:50, background:meta.bg, border:`1px solid ${meta.border}`, color:meta.color }}>
                              {count} {count===1?"note":"notes"}
                            </span>
                          </div>
                          <div style={{ height:6, borderRadius:6, background:"var(--input-border)", overflow:"hidden" }}>
                            <div style={{ height:"100%", borderRadius:6, width:`${barW}%`, background:meta.color, transition:"width 0.8s cubic-bezier(0.16,1,0.3,1)", minWidth:count>0?6:0 }} />
                          </div>
                          <div style={{ fontSize:10.5, color:"var(--text-muted)", marginTop:4, fontWeight:600 }}>
                            {pct}% of all notes
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: highlight cards */}
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>

              {/* ── Most Used card — handles tie ── */}
              <div style={{
                background: isTie
                  ? "var(--card-bg)"
                  : `linear-gradient(135deg, ${CAT_META[topCats[0]]?.color}22, ${CAT_META[topCats[0]]?.color}08)`,
                border: `1px solid ${isTie ? "var(--card-border)" : `${CAT_META[topCats[0]]?.color}44`}`,
                borderRadius:14, padding:"20px 20px",
                boxShadow:"var(--card-shadow)", cursor:"pointer"
              }} onClick={() => navigate("/notes")}>
                <div style={{ fontSize:10, fontWeight:800, letterSpacing:"0.10em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:10 }}>
                  🏆 Most Used
                </div>

                {total === 0 ? (
                  <div style={{ fontSize:13, color:"var(--text-muted)", fontWeight:600 }}>No notes yet</div>
                ) : isTie ? (
                  /* Tie state */
                  <>
                    <div style={{ fontSize:20, marginBottom:8 }}>🤝</div>
                    <div style={{ fontSize:15, fontWeight:800, color:"var(--text-primary)", marginBottom:8 }}>
                      It's a tie!
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {topCats.map(c => (
                        <span key={c} style={{
                          fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:50,
                          background: CAT_META[c].bg, border:`1px solid ${CAT_META[c].border}`,
                          color: CAT_META[c].color
                        }}>
                          {CAT_META[c].icon} {c} · {catCount[c]}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Single winner */
                  <>
                    <div style={{ fontSize:32, marginBottom:6 }}>{CAT_META[topCats[0]]?.icon}</div>
                    <div style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)", marginBottom:2 }}>{topCats[0]}</div>
                    <div style={{ fontSize:13, color:CAT_META[topCats[0]]?.color, fontWeight:700 }}>
                      {catCount[topCats[0]]} notes
                    </div>
                  </>
                )}
              </div>

              {/* Pin Ratio */}
              <div style={{ background:"var(--card-bg)", border:"1px solid var(--card-border)", borderRadius:14, padding:"18px 20px", boxShadow:"var(--card-shadow)" }}>
                <div style={{ fontSize:10, fontWeight:800, letterSpacing:"0.10em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:14 }}>
                  📌 Pin Ratio
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <RingIndicator pct={total>0?Math.round(pinned/total*100):0} color="#7a7ab8" size={60} />
                  <div>
                    <div style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)", lineHeight:1 }}>
                      {total>0?Math.round(pinned/total*100):0}%
                    </div>
                    <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:3, fontWeight:600 }}>
                      {pinned} of {total} pinned
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty Categories */}
              <div style={{ background:"var(--card-bg)", border:"1px solid var(--card-border)", borderRadius:14, padding:"18px 20px", boxShadow:"var(--card-shadow)" }}>
                <div style={{ fontSize:10, fontWeight:800, letterSpacing:"0.10em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:12 }}>
                  📭 Empty Categories
                </div>
                {CATS.filter(c => catCount[c] === 0).length === 0 ? (
                  <div style={{ fontSize:13, color:"var(--accent)", fontWeight:700 }}>✅ All categories used!</div>
                ) : (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {CATS.filter(c => catCount[c] === 0).map(c => (
                      <span key={c} style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:50, background:"var(--input-bg)", border:"1px solid var(--input-border)", color:"var(--text-muted)" }}>
                        {CAT_META[c].icon} {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── ROW 3: Quick Overview mini cards ── */}
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:"0.09em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:12 }}>
            Quick Overview
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12 }}>
            {CATS.map(cat => {
              const meta  = CAT_META[cat];
              const count = catCount[cat];
              const pct   = total > 0 ? Math.round(count/total*100) : 0;
              return (
                <div key={cat} onClick={() => navigate("/notes")}
                  style={{ background:"var(--card-bg)", border:`1px solid ${meta.border}`, borderRadius:13, padding:"16px 16px 14px", cursor:"pointer", position:"relative", overflow:"hidden", boxShadow:"var(--card-shadow)", transition:"transform 0.22s, box-shadow 0.22s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 8px 24px ${meta.color}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="var(--card-shadow)"; }}
                >
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:meta.color }} />
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <span style={{ fontSize:22 }}>{meta.icon}</span>
                    <span style={{ fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:50, background:meta.bg, color:meta.color, border:`1px solid ${meta.border}` }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{ fontSize:26, fontWeight:800, color:"var(--text-primary)", lineHeight:1, marginBottom:4 }}>{count}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.06em", textTransform:"uppercase" }}>{cat}</div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
