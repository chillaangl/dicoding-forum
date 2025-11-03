import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import Avatar from "../common/Avatar";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav
      style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
        padding: "12px 0",
        marginBottom: "20px",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <Link
              to="/"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#007bff",
                textDecoration: "none",
              }}
            >
              Forum
            </Link>
            <Link to="/" style={{ textDecoration: "none", color: "#333" }}>
              Home
            </Link>
            {token && (
              <Link to="/new" style={{ textDecoration: "none", color: "#333" }}>
                New
              </Link>
            )}
            <Link to="/leaderboard" style={{ textDecoration: "none", color: "#333" }}>
              Leaderboard
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            {token && user ? (
              <>
                <Avatar name={user.name} size={32} />
                <span>{user.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    padding: "6px 12px",
                    textDecoration: "none",
                    color: "#007bff",
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "4px",
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
