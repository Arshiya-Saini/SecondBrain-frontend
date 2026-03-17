import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import "./Login.css";

function Login() {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
    const token = localStorage.getItem("token");
    if (token && token !== "test123") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">

      <span className="blob-b" />
      <span className="blob-c" />

      <span className="particle" />
      <span className="particle" />
      <span className="particle" />
      <span className="particle" />
      <span className="particle" />
      <span className="particle" />

      <div className="login-card">

        <div className="brand">
          <div className="logo">🧠</div>
          <h1>Second Brain</h1>
        </div>

        <h2 className="get-started">Welcome Back</h2>
        <p className="section-title">Login to your account</p>

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

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="password-row">
              <label>Password</label>
              <Link to="#" className="forgot-link">Forgot password?</Link>
            </div>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Logging in…" : "Login →"}
          </button>
        </form>

        <div className="divider"><span>New to Second Brain?</span></div>

        <Link to="/signup" className="primary-btn outline-btn">
          Create a free account →
        </Link>

        <p className="terms-text" style={{ marginTop: 10 }}>
          <Link to="/" style={{ color: "var(--text-muted)", fontSize: 12, textDecoration: "none" }}>
            ← Back to home
          </Link>
        </p>

        <p className="terms-text">
          By continuing, you agree to our{" "}
          <span className="blue-link">Terms</span> &{" "}
          <span className="blue-link">Privacy Policy</span>
        </p>

      </div>
    </div>
  );
}

export default Login;