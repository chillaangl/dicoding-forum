import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setActiveCategory, fetchThreadsWithLoading } from "../../store/slices/threadsSlice";
import { formatDate } from "../../lib/format";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import VoteButtons from "../common/VoteButtons";

function ThreadsPage() {
  const dispatch = useDispatch();
  const threads = useSelector((state) => state.threads.list);
  const categories = useSelector((state) => state.threads.categories);
  const activeCategory = useSelector((state) => state.threads.activeCategory);
  const error = useSelector((state) => state.threads.error);
  const token = useSelector((state) => state.auth.token);
  const users = useSelector((state) => state.users.list);

  const filteredThreads =
    activeCategory === "ALL"
      ? threads
      : threads.filter(
          (t) =>
            t.category &&
            t.category.trim() &&
            t.category
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ") === activeCategory,
        );

  const getOwnerName = (ownerId) => {
    const user = users.find((u) => u.id === ownerId);
    return user?.name || "Unknown";
  };

  const getOwnerAvatar = (ownerId) => {
    const user = users.find((u) => u.id === ownerId);
    return user?.avatar;
  };

  const truncateBody = (body, maxLength = 120) => {
    if (!body) return "";
    const text = body.replace(/<[^>]*>/g, "");
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Threads</h1>
        {token && (
          <Link to="/new">
            <Button variant="primary">Buat Thread</Button>
          </Link>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="category" style={{ marginRight: "10px", fontWeight: "500" }}>
          Filter by category:
        </label>
        <select
          id="category"
          value={activeCategory}
          onChange={(e) => dispatch(setActiveCategory(e.target.value))}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        >
          <option value="ALL">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorState message={error} onRetry={() => dispatch(fetchThreadsWithLoading())} />}

      {!error && filteredThreads.length === 0 && <EmptyState message="No threads available" />}

      {!error && filteredThreads.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredThreads.map((thread) => {
            const ownerName = getOwnerName(thread.ownerId);
            const ownerAvatar = getOwnerAvatar(thread.ownerId);
            return (
              <div
                key={thread.id}
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
                  <Avatar name={ownerName} src={ownerAvatar} size={40} />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <strong>{ownerName}</strong>
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
                <Link
                  to={`/threads/${thread.id}`}
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    display: "block",
                  }}
                >
                  <h2
                    style={{
                      marginBottom: "8px",
                      fontSize: "20px",
                      color: "#007bff",
                    }}
                  >
                    {thread.title}
                  </h2>
                  <p
                    style={{
                      color: "#666",
                      marginBottom: "12px",
                      lineHeight: "1.5",
                    }}
                  >
                    {truncateBody(thread.body)}
                  </p>
                </Link>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "12px",
                  }}
                >
                  <span style={{ color: "#666", fontSize: "14px" }}>
                    {thread.totalComments || 0} comments
                  </span>
                  <VoteButtons
                    threadId={thread.id}
                    upVotesBy={thread.upVotesBy || []}
                    downVotesBy={thread.downVotesBy || []}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ThreadsPage;
