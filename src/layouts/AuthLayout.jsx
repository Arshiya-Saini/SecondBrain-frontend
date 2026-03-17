function AuthLayout({ children }) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    backgroundColor: "#f0f2f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "360px",
    padding: "30px",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  },
};

export default AuthLayout;
