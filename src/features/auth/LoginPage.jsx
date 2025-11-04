import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginWithLoading, getMeWithLoading } from "../../store/slices/authSlice";
import Button from "../common/Button";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector((state) => state.auth.error);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (location.state?.email) {
      setValue("email", location.state.email);
    }
  }, [location.state, setValue]);

  const onSubmit = async (data) => {
    try {
      await dispatch(loginWithLoading({ email: data.email, password: data.password })).unwrap();
      await dispatch(getMeWithLoading()).unwrap();
      navigate("/");
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
      <h1 style={{ marginBottom: "24px", textAlign: "center" }}>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            Password
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
