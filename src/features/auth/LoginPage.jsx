import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginWithLoading, getMeWithLoading } from "../../store/slices/authSlice";
import Button from "../common/Button";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector((state) => state.auth.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Email and password are required");
      return;
    }

    try {
      await dispatch(loginWithLoading({ email, password })).unwrap();
      await dispatch(getMeWithLoading()).unwrap();
      navigate("/");
    } catch (err) {
      const errorMessage =
        typeof err === "string" ? err : err?.message || err?.toString() || "Login failed";
      setLocalError(errorMessage);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "60px auto",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ marginBottom: "24px", textAlign: "center" }}>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
        </div>
        {(localError || error) && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px",
              backgroundColor: "#fee",
              color: "#c33",
              borderRadius: "4px",
            }}
          >
            {localError || String(error || "An error occurred")}
          </div>
        )}
        <Button type="submit" variant="primary" style={{ width: "100%" }}>
          Login
        </Button>
      </form>
      <p style={{ marginTop: "16px", textAlign: "center", color: "#666" }}>
        Don&apos;t have an account?{" "}
        <Link to="/register" style={{ color: "#007bff" }}>
          Register
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
