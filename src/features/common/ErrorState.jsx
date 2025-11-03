function ErrorState({ message = "Something went wrong", onRetry }) {
  const errorMessage =
    typeof message === "string" ? message : String(message || "Something went wrong");

  return (
    <div
      style={{
        padding: "60px 20px",
        textAlign: "center",
        color: "#dc3545",
      }}
    >
      <p>{errorMessage}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorState;
