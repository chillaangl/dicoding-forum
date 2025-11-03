import { Link } from "react-router-dom";
import Button from "./Button";

function NotFound() {
  return (
    <div className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>404</h1>
      <p style={{ fontSize: "18px", color: "#666", marginBottom: "24px" }}>Page not found</p>
      <Link to="/">
        <Button variant="primary">Go to Home</Button>
      </Link>
    </div>
  );
}

export default NotFound;
