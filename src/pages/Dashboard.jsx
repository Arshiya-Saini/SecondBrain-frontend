import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import "./Dashboard.css";

const CATS = ["General", "Work", "Study", "Personal"];
const CAT_META = {
  General:  { color: "#4a9e9e", icon: "📝", gradient: "linear-gradient(135deg,#4a9e9e,#6ababa)" },
  Work:     { color: "#5a82b8", icon: "💼", gradient: "linear-gradient(135deg,#5a82b8,#4a6ab8)" },
  Study:    { color: "#9e7a4a", icon: "📚", gradient: "linear-gradient(135deg,#9e7a4a,#c8a060)" },
  Personal: { color: "#9e4a7a", icon: "🌟", gradient: "linear-gradient(135deg,#9e4a7a,#c87aaa)" },
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [notes,     setNotes]     = useState([]);
  const [title,     setTitle]     = useState("");
  const [content,   setContent]   = useState("");
  const [tags,      setTags]      = useState("");
  const [category,  setCategory]  = useState("General");
  const [editingId, setEditingId] = useState(null);
  const [search,    setSearch]    = useState("");
  const [sortType,  setSortType]  = useState("newest");
  const [page,      setPage]      = useState("dashboard");
  const [theme,     setTheme]     = useState(() => localStorage.getItem("sb-theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sb-theme", theme);
  }, [theme]);

  const fetchNotes = async () => {
    try { const r = await api.get("/api/notes"); setNotes(r.data); }
    catch (e) { console.error(e); }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchNotes(); }, []);

  const total    = notes.length;
  const pinned   = notes.filter(n => n.isPinned).length;
  const catCount = CATS.reduce((a, c) => ({ ...a, [c]: notes.filter(n => n.category === c).length }), {});

  const getList = () => {
    let list = [...notes];
    if (page === "pinned")            list = list.filter(n => n.isPinned);
    else if (page.startsWith("cat:")) list = list.filter(n => n.category === page.slice(4));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return sortType === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    });
    return list;
  };
  const visibleNotes = getList();

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      const tagArr = tags.split(",").map(t => t.trim()).filter(Boolean);
      if (editingId) {
        await api.put(`/api/notes/${editingId}`, { title, content, tags: tagArr, category });
        setEditingId(null);
      } else {
        await api.post("/api/notes", { title, content, tags: tagArr, category });
        setPage("all");
      }
      setTitle(""); setContent(""); setTags(""); setCategory("General");
      fetchNotes();
    } catch (e) { console.error(e); }
  };

  const handleCancel = () => {
    setTitle(""); setContent(""); setTags(""); setCategory("General"); setEditingId(null);
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/api/notes/${id}`); fetchNotes(); }
    catch (e) { console.error(e); }
  };

  const handlePin = async (id) => {
    try { await api.patch(`/api/notes/${id}/pin`); fetchNotes(); }
    catch (e) { console.error(e); }
  };

  const startEdit = (note) => {
    setTitle(note.title); setContent(note.content);
    setTags(note.tags?.join(", ") || "");
    setCategory(note.category || "General");
    setEditingId(note._id);
    setPage("dashboard");
    document.querySelector(".db-body")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fmt = d => d ? new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) : "";

  const pageInfo = {
    dashboard:      { title: "Dashboard",     crumb: "Home" },
    all:            { title: "All Notes",      crumb: "Notes / All" },
    pinned:         { title: "Pinned Notes",   crumb: "Notes / Pinned" },
    "cat:General":  { title: "General Notes",  crumb: "Categories / General"  },
    "cat:Work":     { title: "Work Notes",     crumb: "Categories / Work"     },
    "cat:Study":    { title: "Study Notes",    crumb: "Categories / Study"    },
    "cat:Personal": { title: "Personal Notes", crumb: "Categories / Personal" },
  };
  const info = pageInfo[page] || { title: page, crumb: page };

  return (
    <div className="db-shell" data-theme={theme}>

      <aside className="db-sidebar">
        <div className="sb-brand" onClick={() => setPage("dashboard")} style={{ cursor:"pointer" }}>
          <span className="sb-logo">🧠</span>
          <div>
            <span className="sb-name">Second Brain</span>
            <span className="sb-sub">Your digital memory</span>
          </div>
        </div>

        <nav className="sb-nav">
          <div className="sb-section-label">Menu</div>

          <button className={`sb-link${page === "dashboard" ? " active" : ""}`} onClick={() => setPage("dashboard")}>
            <span className="sb-icon">🏠</span> Dashboard
          </button>

          <button className={`sb-link${page === "all" ? " active" : ""}`} onClick={() => setPage("all")}>
            <span className="sb-icon">📋</span> All Notes
            {total > 0 && <span className="sb-badge">{total}</span>}
          </button>

          <button className={`sb-link${page === "pinned" ? " active" : ""}`} onClick={() => setPage("pinned")}>
            <span className="sb-icon">📌</span> Pinned
            {pinned > 0 && <span className="sb-badge">{pinned}</span>}
          </button>

          <button className="sb-link" onClick={() => navigate("/analytics")}>
            <span className="sb-icon">📊</span> Analytics
          </button>

          <div className="sb-section-label">Categories</div>
          {CATS.map(cat => (
            <button
              key={cat}
              className={`sb-cat-item${page === `cat:${cat}` ? " active" : ""}`}
              onClick={() => setPage(`cat:${cat}`)}
            >
              <span className="sb-cat-dot" style={{ background: CAT_META[cat].color }} />
              <span>{CAT_META[cat].icon} {cat}</span>
              <span className="sb-cat-count">{catCount[cat]}</span>
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
          <button className="sb-footer-btn theme-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <span className="sb-icon">{theme === "light" ? "🌙" : "☀️"}</span>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <button className="sb-footer-btn logout-btn" onClick={handleLogout}>
            <span className="sb-icon">🚪</span> Logout
          </button>
        </div>
      </aside>

      <div className="db-main">
        <header className="db-topbar">
          <div className="topbar-left">
            <span className="topbar-title">{info.title}</span>
            <span className="topbar-crumb">Second Brain / {info.crumb}</span>
          </div>
          <div className="topbar-right">
            {page !== "dashboard" && (
              <div className="topbar-search-wrap">
                <span className="topbar-search-icon">🔍</span>
                <input
                  className="topbar-search"
                  placeholder="Search notes…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            )}
            <div className="topbar-avatar" onClick={() => navigate("/profile")} style={{ cursor:"pointer" }}>😊</div>
          </div>
        </header>

        <div className="db-body">

          {/* ══ DASHBOARD HOME ══ */}
          {page === "dashboard" && (
            <div>
              <div className="page-head">
                <h1>Welcome back 👋</h1>
                <div className="page-head-bar" />
              </div>

              <div className="stats-row">
                <div className="stat-card sc-teal" onClick={() => setPage("all")} style={{ cursor:"pointer" }}>
                  <div className="sc-icon">📋</div>
                  <div className="sc-value">{total}</div>
                  <div className="sc-label">Total Notes</div>
                  <div className="sc-hint">View all →</div>
                </div>
                <div className="stat-card sc-purple" onClick={() => setPage("pinned")} style={{ cursor:"pointer" }}>
                  <div className="sc-icon">📌</div>
                  <div className="sc-value">{pinned}</div>
                  <div className="sc-label">Pinned</div>
                  <div className="sc-hint">View pinned →</div>
                </div>
                {CATS.map(cat => (
                  <div key={cat} className="stat-card" style={{ "--sc-accent": CAT_META[cat].color, cursor:"pointer" }} onClick={() => setPage(`cat:${cat}`)}>
                    <div className="sc-icon">{CAT_META[cat].icon}</div>
                    <div className="sc-value">{catCount[cat]}</div>
                    <div className="sc-label">{cat}</div>
                    <div className="sc-hint">Open →</div>
                  </div>
                ))}
              </div>

              <div className="dash-two-col">
                <div className="form-panel">
                  <div className="fp-head">
                    <span className="fp-icon">{editingId ? "✏️" : "✨"}</span>
                    <span className="fp-title">{editingId ? "Edit Note" : "Quick Create"}</span>
                    {editingId && <span className="fp-badge">Editing</span>}
                  </div>
                  <NoteForm
                    title={title} setTitle={setTitle}
                    content={content} setContent={setContent}
                    tags={tags} setTags={setTags}
                    category={category} setCategory={setCategory}
                    editingId={editingId} onSave={handleSave} onCancel={handleCancel}
                  />
                </div>

                <div className="recent-panel">
                  <div className="rp-head">
                    <span className="rp-title">Recent Notes</span>
                    <button className="rp-view-all" onClick={() => setPage("all")}>View all →</button>
                  </div>
                  {notes.length === 0 ? (
                    <EmptyState icon="📭" title="No notes yet" sub="Use the form on the left to create your first note" />
                  ) : (
                    <div className="recent-list">
                      {[...notes].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6).map(note => (
                        <NoteCard key={note._id} note={note} fmt={fmt} onPin={handlePin} onEdit={startEdit} onDelete={handleDelete} navigate={navigate} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ ALL / PINNED / CATEGORY PAGES ══ */}
          {(page === "all" || page === "pinned" || page.startsWith("cat:")) && (
            <div>
              <div className="page-head">
                <div className="page-head-row">
                  <div>
                    <h1>
                      {page === "pinned" && "📌 Pinned Notes"}
                      {page === "all"    && "📋 All Notes"}
                      {page.startsWith("cat:") && `${CAT_META[page.slice(4)]?.icon} ${page.slice(4)} Notes`}
                    </h1>
                    <div className="page-head-bar" style={page.startsWith("cat:") ? {
                      background: `linear-gradient(90deg,${CAT_META[page.slice(4)]?.color},#7a7ab8)`
                    } : {}} />
                  </div>
                  <button className="btn-new-note" onClick={() => setPage("dashboard")}>+ New Note</button>
                </div>
              </div>

              <div className="notes-toolbar">
                <span className="notes-count">{visibleNotes.length} {visibleNotes.length === 1 ? "note" : "notes"}</span>
                <select className="ctrl-select" value={sortType} onChange={e => setSortType(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <div className="notes-grid">
                {visibleNotes.length === 0 ? (
                  <EmptyState
                    icon={page === "pinned" ? "📌" : "📭"}
                    title="No notes here"
                    sub={search ? "Try a different search term" : page === "pinned" ? "Pin a note to see it here" : "Create a note from the Dashboard"}
                  />
                ) : (
                  visibleNotes.map(note => (
                    <NoteCard key={note._id} note={note} fmt={fmt} onPin={handlePin} onEdit={startEdit} onDelete={handleDelete} navigate={navigate} />
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function NoteForm({ title, setTitle, content, setContent, tags, setTags, category, setCategory, editingId, onSave, onCancel }) {
  return (
    <div className="form-fields">
      <div className="field-wrap">
        <label className="field-label">Title</label>
        <input className="f-input" placeholder="Give your note a title…" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="field-wrap">
        <label className="field-label">Content</label>
        <textarea className="f-textarea" placeholder="What's on your mind?" value={content} onChange={e => setContent(e.target.value)} />
      </div>
      <div className="form-row-2">
        <div className="field-wrap">
          <label className="field-label">Tags</label>
          <input className="f-input" placeholder="ideas, urgent…" value={tags} onChange={e => setTags(e.target.value)} />
        </div>
        <div className="field-wrap">
          <label className="field-label">Category</label>
          <select className="f-select" value={category} onChange={e => setCategory(e.target.value)}>
            {["General","Work","Study","Personal"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="form-actions">
        {editingId && <button className="btn-cancel" onClick={onCancel}>Cancel</button>}
        <button className="btn-primary" onClick={onSave}>{editingId ? "Update Note" : "Add Note"}</button>
      </div>
    </div>
  );
}

/* navigate is passed as a prop so we don't need useNavigate inside — avoids hook rules issues */
function NoteCard({ note, fmt, onPin, onEdit, onDelete, navigate }) {
  const cat  = note.category || "General";
  const meta = CAT_META[cat] || CAT_META.General;
  return (
    <div
      className={`note-card${note.isPinned ? " pinned" : ""}`}
      onClick={() => navigate(`/notes/${note._id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="note-bar" style={{ background: meta.gradient }} />
      <div className="note-body">
        <div className="note-meta-row">
          <span className="note-cat-badge" style={{ background:`${meta.color}18`, color:meta.color, border:`1px solid ${meta.color}44` }}>
            {meta.icon} {cat}
          </span>
          {note.isPinned && <span className="note-pin-badge">📌 Pinned</span>}
        </div>
        <div className="note-title">{note.title}</div>
        <div className="note-content">{note.content}</div>
        {note.tags?.length > 0 && (
          <div className="note-tags">
            {note.tags.map((tag, i) => <span key={i} className="note-tag">#{tag}</span>)}
          </div>
        )}
        {note.createdAt && <div className="note-date">{fmt(note.createdAt)}</div>}
      </div>
      <div className="note-footer" onClick={e => e.stopPropagation()}>
        <button className={`n-btn n-btn-pin${note.isPinned ? " is-pinned" : ""}`} onClick={() => onPin(note._id)}>
          {note.isPinned ? "Unpin" : "📌 Pin"}
        </button>
        <button className="n-btn n-btn-edit" onClick={() => onEdit(note)}>✏️ Edit</button>
        <button className="n-btn n-btn-del" onClick={() => onDelete(note._id)}>🗑️</button>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <div className="notes-empty">
      <span className="notes-empty-icon">{icon}</span>
      <div className="notes-empty-title">{title}</div>
      <div className="notes-empty-sub">{sub}</div>
    </div>
  );
}