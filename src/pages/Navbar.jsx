import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 🚀 FIX: Force re-render when localStorage user changes
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const updateUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);   // 🔥 IMPORTANT
    navigate("/login");
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  console.log("NAV USER:", user);
  console.log("NAV ROLE:", user?.role);

  return (
    <nav
      style={{
        padding: "12px 22px",
        background: "var(--nav-bg)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <div>
        <Link to="/" style={{ marginRight: 14 }}>Home</Link>
        <Link to="/posts" style={{ marginRight: 14 }}>Posts</Link>

        {/* ⭐ SHOW ONLY IF ADMIN */}
        {token && user?.role === "admin" && (
          <>
            <Link to="/dashboard" style={{ marginRight: 14 }}>Dashboard</Link>
            <Link to="/create-post" style={{ marginRight: 14 }}>Create Post</Link>
          </>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {!token ? (
          <>
            <Link to="/login" style={{ marginRight: 12 }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button
            onClick={logout}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: 6,
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
