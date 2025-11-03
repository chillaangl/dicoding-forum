import { useSelector, useDispatch } from "react-redux";
import { fetchLeaderboardWithLoading } from "../../store/slices/leaderboardSlice";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import Avatar from "../common/Avatar";

function LeaderboardPage() {
  const dispatch = useDispatch();
  const leaderboard = useSelector((state) => state.leaderboard.list);
  const error = useSelector((state) => state.leaderboard.error);

  if (error) {
    return (
      <div className="container">
        <ErrorState
          message={error || "Unable to load leaderboard. Please try again."}
          onRetry={() => dispatch(fetchLeaderboardWithLoading())}
        />
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="container">
        <EmptyState message="No leaderboard data available" />
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: "24px" }}>Leaderboard</h1>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  fontWeight: "600",
                  width: "60px",
                }}
              >
                Rank
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  fontWeight: "600",
                }}
              >
                User
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "right",
                  fontWeight: "600",
                }}
              >
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((item, index) => (
              <tr
                key={item.user.id}
                style={{
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                <td style={{ padding: "16px", fontWeight: "500" }}>#{index + 1}</td>
                <td style={{ padding: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Avatar name={item.user.name} size={40} />
                    <span style={{ fontWeight: "500" }}>{item.user.name}</span>
                  </div>
                </td>
                <td style={{ padding: "16px", textAlign: "right", fontWeight: "500" }}>
                  {item.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderboardPage;
