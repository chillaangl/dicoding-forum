import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerWithLoading } from "../../store/slices/authSlice";
import Button from "../common/Button";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccess(false);

    if (!name || !email || !password) {
      setLocalError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    try {
      await dispatch(registerWithLoading({ name, email, password })).unwrap();
      setSuccess(true);
      setTimeout(() => {
        navigate("/login", { state: { email } });
      }, 2000);
    } catch (err) {
      const errorMessage =
        typeof err === "string" ? err : err?.message || err?.toString() || "Registration failed";
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
      <h1 style={{ marginBottom: "24px", textAlign: "center" }}>Register</h1>
      {success ? (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          <p>Registration successful! Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="name"
              style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              Password (min 6 characters)
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
            Register
          </Button>
        </form>
      )}
      <p style={{ marginTop: "16px", textAlign: "center", color: "#666" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#007bff" }}>
          Login
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
