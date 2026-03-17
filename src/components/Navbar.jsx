import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo}>Second Brain</h2>

      <div style={styles.rightSection}>
        {/* 🌙 Dark Mode Toggle */}
        <button
          style={styles.button}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {/* 🚪 Logout */}
        <button
          style={styles.button}
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
  style={styles.button}
  onClick={() => navigate("/profile")}
>
  Profile
</button>

      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#2563eb",
    color: "#fff",
  },
  logo: {
    margin: 0,
  },
  rightSection: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "8px 14px",
    backgroundColor: "#fff",
    color: "#2563eb",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "0.2s ease",
  },
};

export default Navbar;
