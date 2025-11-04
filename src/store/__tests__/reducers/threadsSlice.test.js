import threadsReducer, {
  setActiveCategory,
  optimisticVoteThread,
  rollbackVoteThread,
} from "../../slices/threadsSlice";

// Skenario pengujian: Menguji fungsi reducer threadsSlice untuk memastikan state management thread berjalan dengan benar, termasuk pengaturan kategori aktif, optimistik vote, dan rollback vote.
describe("threadsSlice reducer", () => {
  const initialState = {
    list: [],
    categories: [],
    activeCategory: "ALL",
    error: null,
    voteRollbacks: {},
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe("setActiveCategory", () => {
    it("should update activeCategory and persist to localStorage", () => {
      const category = "JavaScript";
      const action = setActiveCategory(category);
      const state = threadsReducer(initialState, action);

      expect(state.activeCategory).toBe(category);
      expect(localStorage.getItem("df_filter")).toBe(category);
    });

    it("should handle 'ALL' category", () => {
      const action = setActiveCategory("ALL");
      const state = threadsReducer(initialState, action);

      expect(state.activeCategory).toBe("ALL");
      expect(localStorage.getItem("df_filter")).toBe("ALL");
    });
  });

  describe("optimisticVoteThread", () => {
    const mockThread = {
      id: "thread-1",
      title: "Test Thread",
      upVotesBy: [],
      downVotesBy: [],
    };

    const stateWithThread = {
      ...initialState,
      list: [mockThread],
    };

    it("should add userId to upVotesBy when type is 'up'", () => {
      const userId = "user-1";
      const action = optimisticVoteThread({
        threadId: "thread-1",
        type: "up",
        userId,
      });
      const state = threadsReducer(stateWithThread, action);

      const thread = state.list.find((t) => t.id === "thread-1");
      expect(thread.upVotesBy).toContain(userId);
      expect(thread.downVotesBy).not.toContain(userId);
      expect(state.voteRollbacks["thread-1"]).toBeDefined();
      expect(state.voteRollbacks["thread-1"].upVotesBy).toEqual([]);
    });

    it("should remove userId from upVotesBy when already upvoted and type is 'up' again", () => {
      const userId = "user-1";
      const threadWithVote = {
        ...mockThread,
        upVotesBy: [userId],
      };
      const stateWithVote = {
        ...initialState,
        list: [threadWithVote],
      };

      const action = optimisticVoteThread({
        threadId: "thread-1",
        type: "up",
        userId,
      });
      const state = threadsReducer(stateWithVote, action);

      const thread = state.list.find((t) => t.id === "thread-1");
      expect(thread.upVotesBy).toContain(userId);
    });

    it("should add userId to downVotesBy when type is 'down'", () => {
      const userId = "user-1";
      const action = optimisticVoteThread({
        threadId: "thread-1",
        type: "down",
        userId,
      });
      const state = threadsReducer(stateWithThread, action);

      const thread = state.list.find((t) => t.id === "thread-1");
      expect(thread.downVotesBy).toContain(userId);
      expect(thread.upVotesBy).not.toContain(userId);
    });

    it("should remove userId from both arrays when type is 'neutral'", () => {
      const userId = "user-1";
      const threadWithVote = {
        ...mockThread,
        upVotesBy: [userId],
        downVotesBy: [],
      };
      const stateWithVote = {
        ...initialState,
        list: [threadWithVote],
      };

      const action = optimisticVoteThread({
        threadId: "thread-1",
        type: "neutral",
        userId,
      });
      const state = threadsReducer(stateWithVote, action);

      const thread = state.list.find((t) => t.id === "thread-1");
      expect(thread.upVotesBy).not.toContain(userId);
      expect(thread.downVotesBy).not.toContain(userId);
    });

    it("should switch from downvote to upvote correctly", () => {
      const userId = "user-1";
      const threadWithDownvote = {
        ...mockThread,
        upVotesBy: [],
        downVotesBy: [userId],
      };
      const stateWithDownvote = {
        ...initialState,
        list: [threadWithDownvote],
      };

      const action = optimisticVoteThread({
        threadId: "thread-1",
        type: "up",
        userId,
      });
      const state = threadsReducer(stateWithDownvote, action);

      const thread = state.list.find((t) => t.id === "thread-1");
      expect(thread.upVotesBy).toContain(userId);
      expect(thread.downVotesBy).not.toContain(userId);
    });
  });

  describe("rollbackVoteThread", () => {
    const userId = "user-1";
    const mockThread = {
      id: "thread-1",
      title: "Test Thread",
      upVotesBy: [userId],
      downVotesBy: [],
    };

    const stateWithRollback = {
      ...initialState,
      list: [mockThread],
      voteRollbacks: {
        "thread-1": {
          upVotesBy: [],
          downVotesBy: [],
        },
      },
    };

    it("should restore previous vote state from rollback", () => {
      const action = rollbackVoteThread({ threadId: "thread-1" });
      const state = threadsReducer(stateWithRollback, action);

      const thread = state.list.find((t) => t.id === "thread-1");
      expect(thread.upVotesBy).toEqual([]);
      expect(thread.downVotesBy).toEqual([]);
      expect(state.voteRollbacks["thread-1"]).toBeUndefined();
    });

    it("should handle rollback when thread does not exist", () => {
      const action = rollbackVoteThread({ threadId: "non-existent" });
      const state = threadsReducer(stateWithRollback, action);

      expect(state.list).toEqual(stateWithRollback.list);
    });

    it("should handle rollback when rollback data does not exist", () => {
      const stateWithoutRollback = {
        ...initialState,
        list: [mockThread],
        voteRollbacks: {},
      };

      const action = rollbackVoteThread({ threadId: "thread-1" });
      const state = threadsReducer(stateWithoutRollback, action);

      const thread = state.list.find((t) => t.id === "thread-1");
      expect(thread.upVotesBy).toEqual([userId]);
    });
  });
});
