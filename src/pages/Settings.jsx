import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";


function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("sb-theme") || "light"
  );
  const [notifNotes,    setNotifNotes]    = useState(true);
  const [notifUpdates,  setNotifUpdates]  = useState(false);
  const [defaultCat,    setDefaultCat]    = useState("General");
  const [defaultSort,   setDefaultSort]   = useState("newest");
  const [saved,         setSaved]         = useState(false);

  const toggleTheme = (val) => {
    setTheme(val);
    document.documentElement.setAttribute("data-theme", val);
    localStorage.setItem("sb-theme", val);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSave = () => {
    localStorage.setItem("sb-default-cat",  defaultCat);
    localStorage.setItem("sb-default-sort", defaultSort);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── small reusable toggle switch ──
  const Toggle = ({ value, onChange }) => (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 50, cursor: "pointer",
        background: value
          ? "linear-gradient(90deg,#4a9e9e,#7a7ab8)"
          : "var(--input-border)",
        position: "relative", transition: "background 0.28s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3,
        left: value ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.22)",
        transition: "left 0.28s",
      }} />
    </div>
  );

  // ── row inside a panel ──
  const Row = ({ label, sub, right }) => (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "13px 0", borderBottom: "1px solid var(--card-border)", gap: 12,
    }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );

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
          <button className="sb-link" onClick={() => navigate("/notes")}>
            <span className="sb-icon">📋</span> All Notes
          </button>
          <button className="sb-link" onClick={() => navigate("/analytics")}>
            <span className="sb-icon">📊</span> Analytics
          </button>

          <div className="sb-section-label">Account</div>
          <button className="sb-link" onClick={() => navigate("/profile")}>
            <span className="sb-icon">👤</span> Profile
          </button>
          <button className="sb-link active">
            <span className="sb-icon">⚙️</span> Settings
          </button>
        </nav>

        <div className="sb-footer">
          <button
            className="sb-footer-btn theme-btn"
            onClick={() => toggleTheme(theme === "light" ? "dark" : "light")}
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
            <span className="topbar-title">Settings</span>
            <span className="topbar-crumb">Second Brain / Account / Settings</span>
          </div>
          <div className="topbar-right">
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
            <h1>⚙️ Settings</h1>
            <div className="page-head-bar" />
          </div>

          {/* Save success toast */}
          {saved && (
            <div style={{
              position: "fixed", bottom: 28, right: 28, zIndex: 999,
              background: "linear-gradient(120deg,#4a9e9e,#7a7ab8)",
              color: "#fff", padding: "12px 22px", borderRadius: 50,
              fontSize: 13.5, fontWeight: 700,
              boxShadow: "0 6px 24px rgba(74,158,158,0.40)",
              animation: "fadeUp 0.3s ease both",
            }}>
              ✅ Settings saved!
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 580 }}>

            {/* ── Appearance ── */}
            <div className="form-panel">
              <div className="fp-head">
                <span className="fp-icon">🎨</span>
                <span className="fp-title">Appearance</span>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{
                  fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12
                }}>
                  Theme
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {["light", "dark"].map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTheme(t)}
                      style={{
                        flex: 1, padding: "13px 16px", borderRadius: 12, cursor: "pointer",
                        fontFamily: "Nunito, sans-serif", fontSize: 13.5, fontWeight: 700,
                        border: theme === t
                          ? "2px solid var(--accent)"
                          : "1.5px solid var(--input-border)",
                        background: theme === t
                          ? "rgba(74,158,158,0.14)"
                          : "var(--input-bg)",
                        color: theme === t ? "var(--accent)" : "var(--text-mid)",
                        transition: "all 0.22s",
                      }}
                    >
                      {t === "light" ? "☀️ Light Mode" : "🌙 Dark Mode"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Notes Preferences ── */}
            <div className="form-panel">
              <div className="fp-head">
                <span className="fp-icon">📝</span>
                <span className="fp-title">Notes Preferences</span>
              </div>

              <Row
                label="Default Category"
                sub="New notes will use this category by default"
                right={
                  <select
                    className="f-select"
                    value={defaultCat}
                    onChange={(e) => setDefaultCat(e.target.value)}
                    style={{ width: "auto", minWidth: 130 }}
                  >
                    {["General", "Work", "Study", "Personal"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                }
              />

              <Row
                label="Default Sort Order"
                sub="How notes are sorted when you open them"
                right={
                  <select
                    className="f-select"
                    value={defaultSort}
                    onChange={(e) => setDefaultSort(e.target.value)}
                    style={{ width: "auto", minWidth: 150 }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                }
              />

              <div style={{ paddingTop: 16 }}>
                <button className="btn-primary" onClick={handleSave}
                  style={{ padding: "10px 24px", borderRadius: 50, fontSize: 13 }}>
                  💾 Save Preferences
                </button>
              </div>
            </div>

            {/* ── Notifications ── */}
            <div className="form-panel">
              <div className="fp-head">
                <span className="fp-icon">🔔</span>
                <span className="fp-title">Notifications</span>
              </div>

              <Row
                label="Note Reminders"
                sub="Get reminded about your pinned notes"
                right={<Toggle value={notifNotes} onChange={setNotifNotes} />}
              />
              <Row
                label="Product Updates"
                sub="Receive updates about new features"
                right={<Toggle value={notifUpdates} onChange={setNotifUpdates} />}
              />
            </div>

            {/* ── Account ── */}
            <div className="form-panel">
              <div className="fp-head">
                <span className="fp-icon">🔐</span>
                <span className="fp-title">Account</span>
              </div>

              <Row
                label="View Profile"
                sub="See your profile details and stats"
                right={
                  <button className="n-btn n-btn-pin"
                    onClick={() => navigate("/profile")}
                    style={{ whiteSpace: "nowrap" }}>
                    👤 Profile
                  </button>
                }
              />
              <Row
                label="Go to Dashboard"
                sub="Back to your notes dashboard"
                right={
                  <button className="n-btn n-btn-edit"
                    onClick={() => navigate("/dashboard")}
                    style={{ whiteSpace: "nowrap" }}>
                    🏠 Dashboard
                  </button>
                }
              />
              <Row
                label="Logout"
                sub="Sign out of your account"
                right={
                  <button className="n-btn n-btn-del"
                    onClick={handleLogout}
                    style={{ whiteSpace: "nowrap" }}>
                    🚪 Logout
                  </button>
                }
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;