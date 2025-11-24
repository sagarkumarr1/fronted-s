import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "15px 30px",
        background: "#f5f5f5",
        marginBottom: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      {/* Left side */}
      <div>
        <Link to="/" style={{ marginRight: 20 }}>Home</Link>
        <Link to="/posts" style={{ marginRight: 20 }}>Posts</Link>
        {token && (
          <Link to="/dashboard" style={{ marginRight: 20 }}>Dashboard</Link>
        )}
      </div>

      {/* Right side */}
      <div>
        {!token ? (
          <>
            <Link to="/login" style={{ marginRight: 20 }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button
            onClick={logout}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: 5,
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
