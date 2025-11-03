function EmptyState({ message = "No data available" }) {
  return (
    <div
      style={{
        padding: "60px 20px",
        textAlign: "center",
        color: "#666",
      }}
    >
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
