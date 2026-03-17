import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import "./Dashboard.css";

const CATS = ["All", "General", "Work", "Study", "Personal"];
const CAT_META = {
  General:  { color: "#4a9e9e", icon: "📝", gradient: "linear-gradient(135deg,#4a9e9e,#6ababa)" },
  Work:     { color: "#5a82b8", icon: "💼", gradient: "linear-gradient(135deg,#5a82b8,#4a6ab8)" },
  Study:    { color: "#9e7a4a", icon: "📚", gradient: "linear-gradient(135deg,#9e7a4a,#c8a060)" },
  Personal: { color: "#9e4a7a", icon: "🌟", gradient: "linear-gradient(135deg,#9e4a7a,#c87aaa)" },
};

function Notes() {
  const navigate  = useNavigate();
  const [notes,     setNotes]     = useState([]);
  const [search,    setSearch]    = useState("");
  const [sortType,  setSortType]  = useState("newest");
  const [activeCat, setActiveCat] = useState("All");
  const [theme,     setTheme]     = useState(
    () => localStorage.getItem("sb-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sb-theme", theme);
  }, [theme]);

  const fetchNotes = async () => {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchNotes(); }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try { await api.delete(`/api/notes/${id}`); fetchNotes(); }
    catch (err) { console.error(err); }
  };

  const handlePin = async (id, e) => {
    e.stopPropagation();
    try { await api.patch(`/api/notes/${id}/pin`); fetchNotes(); }
    catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  const visibleNotes = notes
    .filter((n) => activeCat === "All" || n.category === activeCat)
    .filter((n) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags?.some((t) => t.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return sortType === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    });

  return (
    <div className="db-shell" data-theme={theme}>

      {/* ── Sidebar ── */}
      <aside className="db-sidebar">
        <div className="sb-brand" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
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
          <button className="sb-link active">
            <span className="sb-icon">📋</span> All Notes
            <span className="sb-badge">{notes.length}</span>
          </button>
          <button className="sb-link" onClick={() => navigate("/analytics")}>
            <span className="sb-icon">📊</span> Analytics
          </button>

          <div className="sb-section-label">Categories</div>
          {CATS.slice(1).map((cat) => (
            <button
              key={cat}
              className={`sb-cat-item${activeCat === cat ? " active" : ""}`}
              onClick={() => setActiveCat(cat)}
            >
              <span className="sb-cat-dot" style={{ background: CAT_META[cat].color }} />
              <span>{CAT_META[cat].icon} {cat}</span>
              <span className="sb-cat-count">
                {notes.filter((n) => n.category === cat).length}
              </span>
            </button>
          ))}

          <div className="sb-section-label">Account</div>
          <button className="sb-link" onClick={() => navigate("/profile")}>
            <span className="sb-icon">👤</span> Profile
          </button>
          <button className="sb-link" onClick={() => navigate("/settings")}>
            <span className="sb-icon">⚙️</span> Settings
          </button>
        </nav>

        <div className="sb-footer">
          <button
            className="sb-footer-btn theme-btn"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <span className="sb-icon">{theme === "light" ? "🌙" : "☀️"}</span>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <button className="sb-footer-btn logout-btn" onClick={handleLogout}>
            <span className="sb-icon">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="db-main">
        <header className="db-topbar">
          <div className="topbar-left">
            <span className="topbar-title">All Notes</span>
            <span className="topbar-crumb">Second Brain / Notes</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-search-wrap">
              <span className="topbar-search-icon">🔍</span>
              <input
                className="topbar-search"
                placeholder="Search notes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div
              className="topbar-avatar"
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
            >
              😊
            </div>
          </div>
        </header>

        <div className="db-body">
          <div className="page-head">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1>📋 All Notes</h1>
                <div className="page-head-bar" />
              </div>
              <button className="btn-primary" onClick={() => navigate("/dashboard")}
                style={{ padding: "10px 22px", borderRadius: 50, fontSize: 13 }}>
                + New Note
              </button>
            </div>
          </div>

          {/* Category filter pills */}
          <div className="notes-toolbar" style={{ marginBottom: 18 }}>
            <span className="notes-count">
              {visibleNotes.length} {visibleNotes.length === 1 ? "note" : "notes"}
              {activeCat !== "All" ? ` · ${activeCat}` : ""}
            </span>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginLeft: "auto", alignItems: "center" }}>
              {CATS.map((cat) => (
                <button
                  key={cat}
                  className={`cat-pill${activeCat === cat ? " active" : ""}`}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </button>
              ))}
              <select
                className="ctrl-select"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Notes grid */}
          <div className="notes-grid">
            {visibleNotes.length === 0 ? (
              <div className="notes-empty">
                <span className="notes-empty-icon">📭</span>
                <div className="notes-empty-title">No notes found</div>
                <div className="notes-empty-sub">
                  {search ? "Try a different search term" : "Go to Dashboard to create your first note"}
                </div>
              </div>
            ) : (
              visibleNotes.map((note) => {
                const cat  = note.category || "General";
                const meta = CAT_META[cat] || CAT_META.General;
                return (
                  <div
                    key={note._id}
                    className={`note-card${note.isPinned ? " pinned" : ""}`}
                    onClick={() => navigate(`/notes/${note._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="note-bar" style={{ background: meta.gradient }} />
                    <div className="note-body">
                      <div className="note-meta-row">
                        <span className="note-cat-badge" style={{
                          background: `${meta.color}18`, color: meta.color,
                          border: `1px solid ${meta.color}44`
                        }}>
                          {meta.icon} {cat}
                        </span>
                        {note.isPinned && <span className="note-pin-badge">📌 Pinned</span>}
                      </div>
                      <div className="note-title">{note.title}</div>
                      <div className="note-content">{note.content}</div>
                      {note.tags?.length > 0 && (
                        <div className="note-tags">
                          {note.tags.map((tag, i) => (
                            <span key={i} className="note-tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                      {note.createdAt && <div className="note-date">{fmt(note.createdAt)}</div>}
                    </div>
                    {/* stopPropagation on footer so buttons don't also navigate */}
                    <div className="note-footer" onClick={e => e.stopPropagation()}>
                      <button
                        className={`n-btn n-btn-pin${note.isPinned ? " is-pinned" : ""}`}
                        onClick={(e) => handlePin(note._id, e)}
                      >
                        {note.isPinned ? "Unpin" : "📌 Pin"}
                      </button>
                      <button
                        className="n-btn n-btn-edit"
                        onClick={(e) => { e.stopPropagation(); navigate("/dashboard"); }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="n-btn n-btn-del"
                        onClick={(e) => handleDelete(note._id, e)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notes;