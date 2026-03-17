import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import "./Dashboard.css";

const CATS = ["General", "Work", "Study", "Personal"];
const CAT_META = {
  General:  { color: "#4a9e9e", icon: "📝" },
  Work:     { color: "#5a82b8", icon: "💼" },
  Study:    { color: "#9e7a4a", icon: "📚" },
  Personal: { color: "#9e4a7a", icon: "🌟" },
};

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [notes,   setNotes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme,   setTheme]   = useState(
    () => localStorage.getItem("sb-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sb-theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, notesRes] = await Promise.all([
          api.get("/api/auth/profile"),
          api.get("/api/notes"),
        ]);
        setProfile(profileRes.data);
        setNotes(notesRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const total   = notes.length;
  const pinned  = notes.filter((n) => n.isPinned).length;
  const catCount = CATS.reduce((acc, c) => ({
    ...acc, [c]: notes.filter((n) => n.category === c).length
  }), {});

  // Get first letter of email for avatar
  const avatarLetter = profile?.email?.[0]?.toUpperCase() || "U";

  // Format join date nicely
  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric"
      })
    : "";

  // Days since joined
  const daysSince = profile?.createdAt
    ? Math.floor((new Date() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24))
    : 0;

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
            <span className="sb-badge">{total}</span>
          </button>
          <button className="sb-link" onClick={() => navigate("/analytics")}>
            <span className="sb-icon">📊</span> Analytics
          </button>

          <div className="sb-section-label">Account</div>
          <button className="sb-link active">
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
            <span className="topbar-title">Profile</span>
            <span className="topbar-crumb">Second Brain / Account / Profile</span>
          </div>
          <div className="topbar-right">
            <div
              className="topbar-avatar"
              style={{
                cursor: "default",
                background: "linear-gradient(135deg,#4a9e9e,#7a7ab8)",
                fontSize: 15, fontWeight: 800, color: "#fff"
              }}
            >
              {avatarLetter}
            </div>
          </div>
        </header>

        <div className="db-body">

          {loading && (
            <div style={{ color: "var(--text-muted)", fontSize: 15, marginTop: 40, textAlign: "center" }}>
              Loading profile…
            </div>
          )}

          {profile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 680 }}>

              {/* ── Hero card ── */}
              <div className="form-panel" style={{ padding: "28px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  {/* Big avatar */}
                  <div style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: "linear-gradient(135deg,#4a9e9e,#7a7ab8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 34, fontWeight: 800, color: "#fff", flexShrink: 0,
                    boxShadow: "0 6px 24px rgba(74,158,158,0.35)",
                    letterSpacing: 0,
                  }}>
                    {avatarLetter}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                      {profile.name || profile.email.split("@")[0]}
                    </div>
                    <div style={{ fontSize: 13.5, color: "var(--text-muted)" }}>
                      {profile.email}
                    </div>
                    <div style={{
                      display: "inline-block", marginTop: 8,
                      fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em",
                      textTransform: "uppercase", padding: "3px 10px",
                      borderRadius: 50, background: "rgba(74,158,158,0.13)",
                      border: "1px solid rgba(74,158,158,0.28)", color: "var(--accent)"
                    }}>
                      ✅ Active Member
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>
                      {daysSince}
                    </div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                      Days Active
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Stats row ── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: 12 }}>
                {[
                  { icon: "📋", value: total,          label: "Total Notes",  color: "#4a9e9e" },
                  { icon: "📌", value: pinned,         label: "Pinned Notes", color: "#7a7ab8" },
                  { icon: "📂", value: CATS.filter(c => catCount[c] > 0).length, label: "Categories Used", color: "#9e7a4a" },
                  { icon: "✍️", value: total - pinned, label: "Unpinned",     color: "#9e4a7a" },
                ].map(({ icon, value, label, color }) => (
                  <div key={label} className="stat-card" style={{ "--sc-accent": color }}>
                    <div className="sc-icon">{icon}</div>
                    <div className="sc-value">{value}</div>
                    <div className="sc-label">{label}</div>
                  </div>
                ))}
              </div>

              {/* ── Account details ── */}
              <div className="form-panel">
                <div className="fp-head">
                  <span className="fp-icon">📋</span>
                  <span className="fp-title">Account Details</span>
                </div>

                {[
                  { label: "Email",         value: profile.email },
                  { label: "Member Since",  value: joinDate },
                  { label: "Days Active",   value: `${daysSince} days` },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "13px 0", borderBottom: "1px solid var(--card-border)"
                  }}>
                    <span style={{
                      fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em",
                      textTransform: "uppercase", color: "var(--text-muted)"
                    }}>
                      {label}
                    </span>
                    <span style={{
                      fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)",
                      wordBreak: "break-all", textAlign: "right", maxWidth: "65%"
                    }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* ── Category breakdown ── */}
              <div className="form-panel">
                <div className="fp-head">
                  <span className="fp-icon">📊</span>
                  <span className="fp-title">Notes Breakdown</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 6 }}>
                  {CATS.map((cat) => {
                    const pct = total > 0 ? Math.round(catCount[cat] / total * 100) : 0;
                    const meta = CAT_META[cat];
                    return (
                      <div key={cat}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-mid)" }}>
                            {meta.icon} {cat}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>
                            {catCount[cat]} notes · {pct}%
                          </span>
                        </div>
                        <div style={{
                          height: 7, borderRadius: 6,
                          background: "var(--input-border)", overflow: "hidden"
                        }}>
                          <div style={{
                            height: "100%", borderRadius: 6,
                            width: `${pct}%`, background: meta.color,
                            transition: "width 0.6s ease",
                            minWidth: pct > 0 ? 6 : 0,
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Quick actions ── */}
              <div className="form-panel">
                <div className="fp-head">
                  <span className="fp-icon">⚡</span>
                  <span className="fp-title">Quick Actions</span>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                  <button className="btn-primary" onClick={() => navigate("/dashboard")}
                    style={{ padding: "10px 20px", borderRadius: 50, fontSize: 13, flex: "none" }}>
                    ✨ Create Note
                  </button>
                  <button className="btn-primary" onClick={() => navigate("/notes")}
                    style={{ padding: "10px 20px", borderRadius: 50, fontSize: 13, flex: "none" }}>
                    📋 View All Notes
                  </button>
                  <button className="btn-primary" onClick={() => navigate("/analytics")}
                    style={{ padding: "10px 20px", borderRadius: 50, fontSize: 13, flex: "none" }}>
                    📊 Analytics
                  </button>
                  <button className="btn-cancel" onClick={() => navigate("/settings")}
                    style={{ padding: "10px 20px", borderRadius: 50, fontSize: 13 }}>
                    ⚙️ Settings
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;