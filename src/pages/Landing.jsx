import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Landing.css";

const FEATURES = [
  { icon:"📝", title:"Smart Notes",      desc:"Create, organise and search notes instantly across all your categories." },
  { icon:"📌", title:"Pin Important",    desc:"Pin your most critical notes so they always stay at the top of your list." },
  { icon:"🏷️", title:"Tags & Categories",desc:"Organise with tags and four colour-coded categories — General, Work, Study, Personal." },
  { icon:"📊", title:"Analytics",        desc:"Visual stats showing how your notes are distributed across categories." },
  { icon:"🌙", title:"Dark Mode",        desc:"Easy on the eyes — switch between light and dark mode anytime." },
  { icon:"🔍", title:"Instant Search",   desc:"Search across titles, content and tags to find any note in seconds." },
];

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Reset theme attribute so landing page always looks correct
    document.documentElement.removeAttribute("data-theme");

    // If already logged in, go straight to dashboard
    const token = localStorage.getItem("token");
    if (token && token !== "test123") {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="landing-page">

      {/* ── Background decoration ── */}
      <div className="ld-blob-a" />
      <div className="ld-blob-b" />
      <div className="ld-blob-c" />
      <div className="ld-particle" />
      <div className="ld-particle" />
      <div className="ld-particle" />
      <div className="ld-particle" />
      <div className="ld-particle" />
      <div className="ld-particle" />

      {/* ══ NAVBAR ══ */}
      <nav className="ld-nav">
        <div className="ld-nav-brand">
          <span className="ld-nav-logo">🧠</span>
          <span className="ld-nav-name">Second Brain</span>
        </div>
        <div className="ld-nav-actions">
          <Link to="/login" className="ld-nav-link ld-nav-login">Login</Link>
          <Link to="/signup" className="ld-nav-link ld-nav-signup">Sign Up Free</Link>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="ld-hero">

        <div className="ld-badge">
          <span className="ld-badge-dot" />
          Your personal knowledge base
        </div>

        <span className="ld-hero-emoji">🧠</span>

        <h1 className="ld-hero-title">
          Your <span>Second Brain</span><br />
          for everything
        </h1>

        <p className="ld-hero-sub">
          Capture ideas, organise thoughts, and never forget anything again.
          Second Brain is your personal note-taking app — simple, fast, and beautiful.
        </p>

        <div className="ld-cta-row">
          <Link to="/signup" className="ld-btn-primary">
            Get Started Free →
          </Link>
          <Link to="/login" className="ld-btn-outline">
            Login to your account
          </Link>
        </div>

        <div className="ld-features">
          {["✅ Free forever", "🔒 Secure & private", "🌙 Dark mode", "📊 Analytics", "🔍 Instant search"].map(f => (
            <div key={f} className="ld-feature-pill">{f}</div>
          ))}
        </div>

      </section>

      {/* ══ FEATURE CARDS ══ */}
      <section className="ld-cards-section">
        <div className="ld-section-label">Everything you need</div>
        <h2 className="ld-section-title">Built for the way you think</h2>

        <div className="ld-cards-grid">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="ld-card">
              <span className="ld-card-icon">{icon}</span>
              <div className="ld-card-title">{title}</div>
              <div className="ld-card-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      

      {/* ══ FOOTER ══ */}
      <footer className="ld-footer">
         
      </footer>

    </div>
  );
}