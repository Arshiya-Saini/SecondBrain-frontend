import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

function Layout({ children }) {
  return (
    <div style={styles.wrapper}>
      <Sidebar />

      <div style={styles.content}>
        <Navbar />
        <div style={styles.page}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
  },
  content: {
    marginLeft: "220px",
    width: "100%",
  },
  page: {
    padding: "30px",
  },
};

export default Layout;
