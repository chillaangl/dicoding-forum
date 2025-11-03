import { useSelector } from "react-redux";

function LoadingOverlay() {
  const loadingCount = useSelector((state) => state.ui.loadingCount);
  if (loadingCount === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        Loading...
      </div>
    </div>
  );
}

export default LoadingOverlay;
