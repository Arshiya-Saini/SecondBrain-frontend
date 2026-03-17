import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Second Brain</h2>

      <nav style={styles.nav}>
        <NavLink to="/dashboard" style={styles.link}>
          Dashboard
        </NavLink>

        <NavLink to="/notes" style={styles.link}>
          Notes
        </NavLink>

        <NavLink to="/analytics" style={styles.link}>
          Analytics
        </NavLink>

        <NavLink to="/settings" style={styles.link}>
          Settings
        </NavLink>
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "#fff",
    position: "fixed",
    padding: "20px",
  },
  logo: {
    marginBottom: "30px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  link: {
    color: "#cbd5e1",
    textDecoration: "none",
  },
};

export default Sidebar;
