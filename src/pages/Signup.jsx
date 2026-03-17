import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";
import "./Login.css";   // ← uses Login.css entirely

function Signup() {
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Always remove dark theme so signup page looks correct
    document.documentElement.removeAttribute("data-theme");
  }, []);

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/signup", { username, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ← login-wrapper matches Login.css
    <div className="login-wrapper">

      {/* Blobs */}
      <span className="blob-b" />
      <span className="blob-c" />

      {/* Particles */}
      <span className="particle" />
      <span className="particle" />
      <span className="particle" />
      <span className="particle" />
      <span className="particle" />
      <span className="particle" />

      {/* ← login-card matches Login.css */}
      <div className="login-card">

        {/* Brand — identical to Login */}
        <div className="brand">
          <div className="logo">🧠</div>
          <h1>Second Brain</h1>
        </div>

        <h2 className="get-started">Create Account</h2>
        <p className="section-title">Start organizing your thoughts</p>

        {/* Error message */}
        {error && (
          <div style={{
            background: "rgba(180,80,80,0.12)",
            border: "1px solid rgba(180,80,80,0.30)",
            borderRadius: 8, padding: "10px 14px",
            color: "#8a3030", fontSize: 13,
            marginBottom: 14, textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {/* Username */}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="your name"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          className="primary-btn"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Creating account…" : "Sign Up →"}
        </button>

        <div className="divider"><span>Already have an account?</span></div>

        <Link to="/login" className="primary-btn outline-btn">
          Login instead →
        </Link>

        <p className="terms-text">
          By continuing, you agree to our{" "}
          <span className="blue-link">Terms</span> &{" "}
          <span className="blue-link">Privacy Policy</span>
        </p>

      </div>
    </div>
  );
}

export default Signup;