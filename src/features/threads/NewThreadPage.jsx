import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createThreadWithLoading } from "../../store/slices/threadsSlice";
import Button from "../common/Button";

function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loadingCount = useSelector((state) => state.ui.loadingCount);
  const isLoading = loadingCount > 0;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError("");

    if (!title.trim() || !body.trim()) {
      setError("Title and body are required");
      return;
    }

    try {
      await dispatch(
        createThreadWithLoading({ title, body, category: category || undefined }),
      ).unwrap();
      navigate("/");
    } catch (err) {
      const errorMessage =
        typeof err === "string"
          ? err
          : err?.message || err?.toString() || "Unable to create thread. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: "24px" }}>Create New Thread</h1>
      <div
        style={{
          maxWidth: "800px",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="title"
              style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              htmlFor="category"
              style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
            >
              Category (optional)
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., General, React, JavaScript"
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
              htmlFor="body"
              style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
            >
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
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
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "12px" }}>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Thread"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewThreadPage;
