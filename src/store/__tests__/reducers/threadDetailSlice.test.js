import threadDetailReducer, {
  optimisticVoteComment,
  rollbackVoteComment,
} from "../../slices/threadDetailSlice";

// Skenario pengujian: Menguji fungsi reducer threadDetailSlice untuk memastikan state management detail thread dan komentar berjalan dengan benar, termasuk optimistik vote dan rollback vote pada komentar.
describe("threadDetailSlice reducer", () => {
  const initialState = {
    data: null,
    error: null,
    voteRollbacks: {},
  };

  const mockThreadDetail = {
    id: "thread-1",
    title: "Test Thread",
    body: "Test body",
    comments: [
      {
        id: "comment-1",
        content: "First comment",
        upVotesBy: [],
        downVotesBy: [],
      },
      {
        id: "comment-2",
        content: "Second comment",
        upVotesBy: [],
        downVotesBy: [],
      },
    ],
    upVotesBy: [],
    downVotesBy: [],
  };

  const stateWithData = {
    ...initialState,
    data: mockThreadDetail,
  };

  describe("optimisticVoteComment", () => {
    it("should add userId to upVotesBy when type is 'up'", () => {
      const userId = "user-1";
      const action = optimisticVoteComment({
        commentId: "comment-1",
        type: "up",
        userId,
      });
      const state = threadDetailReducer(stateWithData, action);

      const comment = state.data.comments.find((c) => c.id === "comment-1");
      expect(comment.upVotesBy).toContain(userId);
      expect(comment.downVotesBy).not.toContain(userId);
      expect(state.voteRollbacks["comment-1"]).toBeDefined();
      expect(state.voteRollbacks["comment-1"].upVotesBy).toEqual([]);
    });

    it("should add userId to downVotesBy when type is 'down'", () => {
      const userId = "user-1";
      const action = optimisticVoteComment({
        commentId: "comment-1",
        type: "down",
        userId,
      });
      const state = threadDetailReducer(stateWithData, action);

      const comment = state.data.comments.find((c) => c.id === "comment-1");
      expect(comment.downVotesBy).toContain(userId);
      expect(comment.upVotesBy).not.toContain(userId);
    });

    it("should remove userId from both arrays when type is 'neutral'", () => {
      const userId = "user-1";
      const commentWithVote = {
        ...mockThreadDetail,
        comments: [
          {
            id: "comment-1",
            content: "First comment",
            upVotesBy: [userId],
            downVotesBy: [],
          },
        ],
      };
      const stateWithVote = {
        ...initialState,
        data: commentWithVote,
      };

      const action = optimisticVoteComment({
        commentId: "comment-1",
        type: "neutral",
        userId,
      });
      const state = threadDetailReducer(stateWithVote, action);

      const comment = state.data.comments.find((c) => c.id === "comment-1");
      expect(comment.upVotesBy).not.toContain(userId);
      expect(comment.downVotesBy).not.toContain(userId);
    });

    it("should switch from downvote to upvote correctly", () => {
      const userId = "user-1";
      const commentWithDownvote = {
        ...mockThreadDetail,
        comments: [
          {
            id: "comment-1",
            content: "First comment",
            upVotesBy: [],
            downVotesBy: [userId],
          },
        ],
      };
      const stateWithDownvote = {
        ...initialState,
        data: commentWithDownvote,
      };

      const action = optimisticVoteComment({
        commentId: "comment-1",
        type: "up",
        userId,
      });
      const state = threadDetailReducer(stateWithDownvote, action);

      const comment = state.data.comments.find((c) => c.id === "comment-1");
      expect(comment.upVotesBy).toContain(userId);
      expect(comment.downVotesBy).not.toContain(userId);
    });

    it("should not modify state when comment does not exist", () => {
      const action = optimisticVoteComment({
        commentId: "non-existent",
        type: "up",
        userId: "user-1",
      });
      const state = threadDetailReducer(stateWithData, action);

      expect(state).toEqual(stateWithData);
    });

    it("should not modify state when data is null", () => {
      const action = optimisticVoteComment({
        commentId: "comment-1",
        type: "up",
        userId: "user-1",
      });
      const state = threadDetailReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe("rollbackVoteComment", () => {
    const userId = "user-1";
    const commentWithVote = {
      ...mockThreadDetail,
      comments: [
        {
          id: "comment-1",
          content: "First comment",
          upVotesBy: [userId],
          downVotesBy: [],
        },
      ],
    };

    const stateWithRollback = {
      ...initialState,
      data: commentWithVote,
      voteRollbacks: {
        "comment-1": {
          upVotesBy: [],
          downVotesBy: [],
        },
      },
    };

    it("should restore previous vote state from rollback", () => {
      const action = rollbackVoteComment({ commentId: "comment-1" });
      const state = threadDetailReducer(stateWithRollback, action);

      const comment = state.data.comments.find((c) => c.id === "comment-1");
      expect(comment.upVotesBy).toEqual([]);
      expect(comment.downVotesBy).toEqual([]);
      expect(state.voteRollbacks["comment-1"]).toBeUndefined();
    });

    it("should handle rollback when comment does not exist", () => {
      const action = rollbackVoteComment({ commentId: "non-existent" });
      const state = threadDetailReducer(stateWithRollback, action);

      expect(state.data).toEqual(stateWithRollback.data);
    });

    it("should handle rollback when rollback data does not exist", () => {
      const stateWithoutRollback = {
        ...initialState,
        data: commentWithVote,
        voteRollbacks: {},
      };

      const action = rollbackVoteComment({ commentId: "comment-1" });
      const state = threadDetailReducer(stateWithoutRollback, action);

      const comment = state.data.comments.find((c) => c.id === "comment-1");
      expect(comment.upVotesBy).toEqual([userId]);
    });

    it("should not modify state when data is null", () => {
      const action = rollbackVoteComment({ commentId: "comment-1" });
      const state = threadDetailReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });
});
