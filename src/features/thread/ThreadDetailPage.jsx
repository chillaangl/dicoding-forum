import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  fetchThreadDetailWithLoading,
  createCommentWithLoading,
} from "../../store/slices/threadDetailSlice";
import { formatDate } from "../../lib/format";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import VoteButtons from "../common/VoteButtons";

function ThreadDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const thread = useSelector((state) => state.threadDetail.data);
  const error = useSelector((state) => state.threadDetail.error);
  const token = useSelector((state) => state.auth.token);
  const loadingCount = useSelector((state) => state.ui.loadingCount);
  const isLoading = loadingCount > 0;
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(fetchThreadDetailWithLoading(id));
  }, [dispatch, id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || isLoading) return;

    try {
      await dispatch(createCommentWithLoading({ threadId: id, content: comment })).unwrap();
      setComment("");
    } catch (err) {
      // Error handled by ErrorState
    }
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  if (error) {
    return (
      <div className="container">
        <ErrorState
          message={error || "Unable to load thread. Please try again."}
          onRetry={() => dispatch(fetchThreadDetailWithLoading(id))}
        />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="container">
        <EmptyState message="Thread not found" />
      </div>
    );
  }

  return (
    <div className="container">
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <Avatar name={thread.owner?.name} src={thread.owner?.avatar} size={40} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <strong>{thread.owner?.name || "Unknown"}</strong>
              <span style={{ color: "#666", fontSize: "14px" }}>
                {formatDate(thread.createdAt)}
              </span>
            </div>
            {thread.category && (
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 8px",
                  backgroundColor: "#e9ecef",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                {thread.category}
              </span>
            )}
          </div>
        </div>
        <h1 style={{ marginBottom: "16px", fontSize: "24px" }}>{thread.title}</h1>
        <div
          style={{
            color: "#333",
            lineHeight: "1.6",
            marginBottom: "16px",
            whiteSpace: "pre-wrap",
          }}
        >
          {stripHtml(thread.body)}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#666", fontSize: "14px" }}>
            {thread.comments?.length || 0} comments
          </span>
          <VoteButtons
            threadId={id}
            upVotesBy={thread.upVotesBy || []}
            downVotesBy={thread.downVotesBy || []}
            isDetailPage
          />
        </div>
      </div>

      {token ? (
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ marginBottom: "16px", fontSize: "20px" }}>Add Comment</h2>
          <form onSubmit={handleSubmitComment}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                fontFamily: "inherit",
                marginBottom: "12px",
                resize: "vertical",
              }}
            />
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "24px",
            borderRadius: "8px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <p style={{ marginBottom: "12px", color: "#666" }}>Please login to add a comment</p>
          <Link to="/login">
            <Button variant="primary">Login</Button>
          </Link>
        </div>
      )}

      <div>
        <h2 style={{ marginBottom: "16px", fontSize: "20px" }}>Comments</h2>
        {thread.comments && thread.comments.length === 0 ? (
          <EmptyState message="No comments yet" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {thread.comments?.map((commentItem) => (
              <div
                key={commentItem.id}
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <Avatar
                    name={commentItem.owner?.name}
                    src={commentItem.owner?.avatar}
                    size={32}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <strong>{commentItem.owner?.name || "Unknown"}</strong>
                      <span style={{ color: "#666", fontSize: "14px" }}>
                        {formatDate(commentItem.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    color: "#333",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                    marginBottom: "12px",
                  }}
                >
                  {stripHtml(commentItem.content)}
                </div>
                <VoteButtons
                  threadId={id}
                  commentId={commentItem.id}
                  upVotesBy={commentItem.upVotesBy || []}
                  downVotesBy={commentItem.downVotesBy || []}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ThreadDetailPage;
