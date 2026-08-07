import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav>
      <Link to="/" className="navbar-brand">MedTracker</Link>
      {isAuthenticated ? (
        <>
          <Link to="/orders">Orders</Link>
          {isAdmin && <Link to="/admin">Admin</Link>}
          <button className="logout-btn" onClick={() => { logout(); navigate("/login"); }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}