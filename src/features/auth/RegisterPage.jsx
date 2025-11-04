import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerWithLoading } from "../../store/slices/authSlice";
import Button from "../common/Button";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);

  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(
        registerWithLoading({ name: data.name, email: data.email, password: data.password }),
      ).unwrap();
      setSuccess(true);
      setTimeout(() => {
        navigate("/login", { state: { email: data.email } });
      }, 2000);
    } catch (err) {
      // Error is handled by Redux state
      // Error message is displayed via Redux state in the UI
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
        <form onSubmit={handleSubmit(onSubmit)}>
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
              {...register("name")}
              style={{
                width: "100%",
                padding: "10px",
                border: errors.name ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
            {errors.name && (
              <p style={{ color: "#dc3545", fontSize: "14px", marginTop: "4px" }}>
                {errors.name.message}
              </p>
            )}
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
              {...register("email")}
              style={{
                width: "100%",
                padding: "10px",
                border: errors.email ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
            {errors.email && (
              <p style={{ color: "#dc3545", fontSize: "14px", marginTop: "4px" }}>
                {errors.email.message}
              </p>
            )}
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
              {...register("password")}
              style={{
                width: "100%",
                padding: "10px",
                border: errors.password ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
            {errors.password && (
              <p style={{ color: "#dc3545", fontSize: "14px", marginTop: "4px" }}>
                {errors.password.message}
              </p>
            )}
          </div>
          {error && (
            <div
              style={{
                marginBottom: "16px",
                padding: "10px",
                backgroundColor: "#fee",
                color: "#c33",
                borderRadius: "4px",
              }}
            >
              {String(error || "An error occurred")}
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
