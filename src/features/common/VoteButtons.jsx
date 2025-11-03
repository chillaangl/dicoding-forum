import { useDispatch, useSelector } from "react-redux";
import { voteThreadWithLoading } from "../../store/slices/threadsSlice";
import {
  voteThreadDetailWithLoading,
  voteCommentWithLoading,
} from "../../store/slices/threadDetailSlice";

function VoteButtons({
  threadId,
  commentId,
  upVotesBy = [],
  downVotesBy = [],
  isDetailPage = false,
}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const loadingCount = useSelector((state) => state.ui.loadingCount);

  const userId = user?.id;
  const isUpvoted = userId && upVotesBy.includes(userId);
  const isDownvoted = userId && downVotesBy.includes(userId);
  const isLoading = loadingCount > 0;
  const upvotesCount = upVotesBy.length;
  const downvotesCount = downVotesBy.length;

  const handleVote = async (type) => {
    if (!token || !userId || isLoading) return;

    try {
      if (commentId) {
        await dispatch(voteCommentWithLoading({ threadId, commentId, type, userId })).unwrap();
      } else if (isDetailPage) {
        await dispatch(voteThreadDetailWithLoading({ threadId, type, userId })).unwrap();
      } else {
        await dispatch(voteThreadWithLoading({ threadId, type, userId })).unwrap();
      }
    } catch (error) {
      // Error handling via optimistic rollback
    }
  };

  const handleUpClick = () => {
    const nextType = isUpvoted ? "neutral" : "up";
    handleVote(nextType);
  };

  const handleDownClick = () => {
    const nextType = isDownvoted ? "neutral" : "down";
    handleVote(nextType);
  };

  if (!token) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          type="button"
          disabled
          title="Login untuk vote"
          style={{
            padding: "4px 8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#f5f5f5",
            cursor: "not-allowed",
            color: "#999",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          aria-label="Upvote (login required)"
        >
          <span>👍</span>
          <span style={{ fontSize: "12px" }}>{upvotesCount}</span>
        </button>
        <button
          type="button"
          disabled
          title="Login untuk vote"
          style={{
            padding: "4px 8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#f5f5f5",
            cursor: "not-allowed",
            color: "#999",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          aria-label="Downvote (login required)"
        >
          <span>👎</span>
          <span style={{ fontSize: "12px" }}>{downvotesCount}</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <button
        type="button"
        onClick={handleUpClick}
        disabled={isLoading}
        aria-pressed={isUpvoted}
        title={isUpvoted ? "Remove upvote" : "Upvote"}
        style={{
          padding: "4px 8px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: isUpvoted ? "#007bff" : "white",
          color: isUpvoted ? "white" : "#333",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
        aria-label="Upvote"
      >
        <span>👍</span>
        <span style={{ fontSize: "12px" }}>{upvotesCount}</span>
      </button>
      <button
        type="button"
        onClick={handleDownClick}
        disabled={isLoading}
        aria-pressed={isDownvoted}
        title={isDownvoted ? "Remove downvote" : "Downvote"}
        style={{
          padding: "4px 8px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: isDownvoted ? "#dc3545" : "white",
          color: isDownvoted ? "white" : "#333",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
        aria-label="Downvote"
      >
        <span>👎</span>
        <span style={{ fontSize: "12px" }}>{downvotesCount}</span>
      </button>
    </div>
  );
}

export default VoteButtons;
