import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";
import "./Dashboard.css";

const CAT_META = {
  General:  { color: "#4a9e9e", bg: "rgba(74,158,158,0.10)",  border: "rgba(74,158,158,0.25)",  icon: "📝", gradient: "linear-gradient(135deg,#4a9e9e,#6ababa)" },
  Work:     { color: "#5a82b8", bg: "rgba(90,130,184,0.10)",  border: "rgba(90,130,184,0.25)",  icon: "💼", gradient: "linear-gradient(135deg,#5a82b8,#4a6ab8)" },
  Study:    { color: "#9e7a4a", bg: "rgba(158,122,74,0.10)",  border: "rgba(158,122,74,0.25)",  icon: "📚", gradient: "linear-gradient(135deg,#9e7a4a,#c8a060)" },
  Personal: { color: "#9e4a7a", bg: "rgba(158,74,122,0.10)",  border: "rgba(158,74,122,0.25)",  icon: "🌟", gradient: "linear-gradient(135deg,#9e4a7a,#c87aaa)" },
};

function NoteDetail() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [note,      setNote]    = useState(null);
  const [loading,   setLoading] = useState(true);
  const [notFound,  setNotFound]= useState(false);
  const [theme,     setTheme]   = useState(
    () => localStorage.getItem("sb-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sb-theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/api/notes/${id}`);
        setNote(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/api/notes/${id}`);
      navigate("/notes");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePin = async () => {
    try {
      const res = await api.patch(`/api/notes/${id}/pin`);
      setNote(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric"
    }) : "";

  const fmtShort = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    }) : "";

  const cat  = note?.category || "General";
  const meta = CAT_META[cat] || CAT_META.General;

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
          <button className="sb-link" onClick={() => navigate("/dashboard")}>
            <span className="sb-icon">🏠</span> Dashboard
          </button>
          <button className="sb-link active" onClick={() => navigate("/notes")}>
            <span className="sb-icon">📋</span> All Notes
          </button>
          <button className="sb-link" onClick={() => navigate("/analytics")}>
            <span className="sb-icon">📊</span> Analytics
          </button>

          <div className="sb-section-label">Account</div>
          <button className="sb-link" onClick={() => navigate("/profile")}>
            <span className="sb-icon">👤</span> Profile
          </button>
          <button className="sb-link" onClick={() => navigate("/settings")}>
            <span className="sb-icon">⚙️</span> Settings
          </button>
        </nav>

        <div className="sb-footer">
          <button className="sb-footer-btn theme-btn"
            onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
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
            <span className="topbar-title">Note Detail</span>
            <span className="topbar-crumb">Second Brain / Notes / View</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-avatar" onClick={() => navigate("/profile")} style={{ cursor:"pointer" }}>😊</div>
          </div>
        </header>

        <div className="db-body">

          {/* ── Loading ── */}
          {loading && (
            <div style={{ textAlign:"center", padding:"60px 20px", color:"var(--text-muted)", fontSize:15 }}>
              Loading note…
            </div>
          )}

          {/* ── Not found ── */}
          {notFound && (
            <div style={{ textAlign:"center", padding:"60px 20px" }}>
              <div style={{ fontSize:52, marginBottom:16 }}>📭</div>
              <div style={{ fontSize:20, fontWeight:800, color:"var(--text-primary)", marginBottom:8 }}>
                Note not found
              </div>
              <div style={{ fontSize:14, color:"var(--text-muted)", marginBottom:24 }}>
                This note may have been deleted or doesn't exist.
              </div>
              <button className="btn-primary" onClick={() => navigate("/notes")}
                style={{ padding:"10px 24px", borderRadius:50, fontSize:13, display:"inline-block" }}>
                ← Back to Notes
              </button>
            </div>
          )}

          {/* ── Note content ── */}
          {note && (
            <div style={{ maxWidth: 780, margin: "0 auto" }}>

              {/* Back button */}
              <button
                onClick={() => navigate("/notes")}
                style={{
                  display:"flex", alignItems:"center", gap:6,
                  background:"none", border:"none", cursor:"pointer",
                  fontSize:13, fontWeight:700, color:"var(--text-muted)",
                  padding:"0 0 18px 0", fontFamily:"Nunito, sans-serif",
                  transition:"color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color="var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.color="var(--text-muted)"}
              >
                ← Back to Notes
              </button>

              {/* Main note card */}
              <div style={{
                background:"var(--card-bg)", border:"1px solid var(--card-border)",
                borderRadius:18, boxShadow:"var(--card-shadow)",
                overflow:"hidden", marginBottom:16,
              }}>
                {/* Colour bar */}
                <div style={{ height:5, background:meta.gradient }} />

                <div style={{ padding:"28px 32px 24px" }}>

                  {/* Meta row */}
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, flexWrap:"wrap" }}>
                    <span style={{
                      fontSize:11, fontWeight:800, padding:"3px 11px", borderRadius:50,
                      background:meta.bg, border:`1px solid ${meta.border}`, color:meta.color,
                      letterSpacing:"0.06em", textTransform:"uppercase"
                    }}>
                      {meta.icon} {cat}
                    </span>
                    {note.isPinned && (
                      <span style={{
                        fontSize:11, fontWeight:800, padding:"3px 11px", borderRadius:50,
                        background:"rgba(74,158,158,0.13)", border:"1px solid rgba(74,158,158,0.28)",
                        color:"var(--accent)", letterSpacing:"0.06em", textTransform:"uppercase"
                      }}>
                        📌 Pinned
                      </span>
                    )}
                    <span style={{ marginLeft:"auto", fontSize:12, color:"var(--text-muted)", fontWeight:600 }}>
                      {fmt(note.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 style={{
                    fontSize:26, fontWeight:800, color:"var(--text-primary)",
                    margin:"0 0 20px 0", lineHeight:1.3,
                  }}>
                    {note.title}
                  </h1>

                  {/* Divider */}
                  <div style={{ height:1, background:"var(--card-border)", marginBottom:22 }} />

                  {/* Content — full, no clamp */}
                  <div style={{
                    fontSize:15, color:"var(--text-mid)", lineHeight:1.85,
                    whiteSpace:"pre-wrap", wordBreak:"break-word",
                  }}>
                    {note.content}
                  </div>

                  {/* Tags */}
                  {note.tags?.length > 0 && (
                    <div style={{ marginTop:24, display:"flex", flexWrap:"wrap", gap:7 }}>
                      {note.tags.map((tag, i) => (
                        <span key={i} style={{
                          fontSize:12, fontWeight:600, padding:"3px 11px", borderRadius:50,
                          background:"rgba(74,158,158,0.10)", border:"1px solid rgba(74,158,158,0.22)",
                          color:"var(--accent-dark)"
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Info + Actions row */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>

                {/* Note info card */}
                <div style={{
                  background:"var(--card-bg)", border:"1px solid var(--card-border)",
                  borderRadius:14, padding:"18px 20px", boxShadow:"var(--card-shadow)"
                }}>
                  <div style={{ fontSize:11, fontWeight:800, letterSpacing:"0.09em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:14 }}>
                    📋 Note Info
                  </div>
                  {[
                    { label:"Created",   value: fmt(note.createdAt) },
                    { label:"Updated",   value: note.updatedAt !== note.createdAt ? fmtShort(note.updatedAt) : "Not edited" },
                    { label:"Category",  value: `${meta.icon} ${cat}` },
                    { label:"Tags",      value: note.tags?.length > 0 ? `${note.tags.length} tag${note.tags.length>1?"s":""}` : "No tags" },
                    { label:"Status",    value: note.isPinned ? "📌 Pinned" : "Unpinned" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      display:"flex", justifyContent:"space-between",
                      padding:"8px 0", borderBottom:"1px solid var(--card-border)",
                      fontSize:12.5,
                    }}>
                      <span style={{ fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", fontSize:10.5, letterSpacing:"0.06em" }}>
                        {label}
                      </span>
                      <span style={{ fontWeight:600, color:"var(--text-primary)", textAlign:"right" }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions card */}
                <div style={{
                  background:"var(--card-bg)", border:"1px solid var(--card-border)",
                  borderRadius:14, padding:"18px 20px", boxShadow:"var(--card-shadow)"
                }}>
                  <div style={{ fontSize:11, fontWeight:800, letterSpacing:"0.09em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:14 }}>
                    ⚡ Actions
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>

                    {/* Edit */}
                    <button
                      onClick={() => navigate("/dashboard", { state: { editNote: note } })}
                      style={{
                        padding:"11px 16px", borderRadius:50, border:"none", cursor:"pointer",
                        fontFamily:"Nunito, sans-serif", fontSize:13.5, fontWeight:700,
                        color:"#fff", background:"linear-gradient(120deg,#4a9e9e,#5a82b8,#7a6aaa)",
                        transition:"transform 0.2s, box-shadow 0.2s", textAlign:"left",
                        display:"flex", alignItems:"center", gap:8,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 18px rgba(74,158,158,0.40)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
                    >
                      ✏️ Edit Note
                    </button>

                    {/* Pin */}
                    <button
                      onClick={handlePin}
                      style={{
                        padding:"11px 16px", borderRadius:50, cursor:"pointer",
                        fontFamily:"Nunito, sans-serif", fontSize:13.5, fontWeight:700,
                        background:"rgba(74,158,158,0.10)", color:"var(--accent)",
                        border:"1.5px solid rgba(74,158,158,0.28)",
                        transition:"background 0.2s, transform 0.2s",
                        display:"flex", alignItems:"center", gap:8,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background="rgba(74,158,158,0.20)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="rgba(74,158,158,0.10)"; e.currentTarget.style.transform="translateY(0)"; }}
                    >
                      {note.isPinned ? "📌 Unpin Note" : "📌 Pin Note"}
                    </button>

                    {/* Back to notes */}
                    <button
                      onClick={() => navigate("/notes")}
                      style={{
                        padding:"11px 16px", borderRadius:50, cursor:"pointer",
                        fontFamily:"Nunito, sans-serif", fontSize:13.5, fontWeight:700,
                        background:"rgba(90,130,184,0.10)", color:"#5a82b8",
                        border:"1.5px solid rgba(90,130,184,0.28)",
                        transition:"background 0.2s, transform 0.2s",
                        display:"flex", alignItems:"center", gap:8,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background="rgba(90,130,184,0.20)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="rgba(90,130,184,0.10)"; e.currentTarget.style.transform="translateY(0)"; }}
                    >
                      📋 All Notes
                    </button>

                    {/* Delete */}
                    <button
                      onClick={handleDelete}
                      style={{
                        padding:"11px 16px", borderRadius:50, cursor:"pointer",
                        fontFamily:"Nunito, sans-serif", fontSize:13.5, fontWeight:700,
                        background:"rgba(180,80,80,0.10)", color:"#8a3030",
                        border:"1.5px solid rgba(180,80,80,0.26)",
                        transition:"background 0.2s, transform 0.2s",
                        display:"flex", alignItems:"center", gap:8,
                        marginTop:"auto",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background="rgba(180,80,80,0.22)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="rgba(180,80,80,0.10)"; e.currentTarget.style.transform="translateY(0)"; }}
                    >
                      🗑️ Delete Note
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoteDetail;