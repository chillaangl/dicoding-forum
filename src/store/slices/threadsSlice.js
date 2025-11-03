import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/api";
import { pushLoading, popLoading } from "./uiSlice";

export const fetchThreads = createAsyncThunk(
  "threads/fetchThreads",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/threads");
      return response.data.data.threads;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch threads");
    }
  },
);

export const createThread = createAsyncThunk(
  "threads/createThread",
  async ({ title, body, category }, { rejectWithValue }) => {
    try {
      const response = await api.post("/threads", { title, body, category });
      return response.data.data.thread;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create thread");
    }
  },
);

export const voteThread = createAsyncThunk(
  "threads/voteThread",
  async ({ threadId, type }, { rejectWithValue }) => {
    try {
      let endpoint = "";
      if (type === "up") {
        endpoint = `/threads/${threadId}/up-vote`;
      } else if (type === "down") {
        endpoint = `/threads/${threadId}/down-vote`;
      } else {
        endpoint = `/threads/${threadId}/neutral-vote`;
      }
      await api.post(endpoint);
      return { threadId, type };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to vote thread");
    }
  },
);

const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const threadsSlice = createSlice({
  name: "threads",
  initialState: {
    list: [],
    categories: [],
    activeCategory: localStorage.getItem("df_filter") || "ALL",
    error: null,
    voteRollbacks: {},
  },
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
      localStorage.setItem("df_filter", action.payload);
    },
    optimisticVoteThread: (state, action) => {
      const { threadId, type, userId } = action.payload;
      const thread = state.list.find((t) => t.id === threadId);
      if (!thread) return;

      const prevUpVotes = [...(thread.upVotesBy || [])];
      const prevDownVotes = [...(thread.downVotesBy || [])];

      state.voteRollbacks[threadId] = {
        upVotesBy: prevUpVotes,
        downVotesBy: prevDownVotes,
      };

      if (type === "up") {
        thread.upVotesBy = thread.upVotesBy || [];
        thread.downVotesBy = thread.downVotesBy || [];
        if (!thread.upVotesBy.includes(userId)) {
          thread.upVotesBy.push(userId);
        }
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      } else if (type === "down") {
        thread.upVotesBy = thread.upVotesBy || [];
        thread.downVotesBy = thread.downVotesBy || [];
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        if (!thread.downVotesBy.includes(userId)) {
          thread.downVotesBy.push(userId);
        }
      } else {
        thread.upVotesBy = (thread.upVotesBy || []).filter((id) => id !== userId);
        thread.downVotesBy = (thread.downVotesBy || []).filter((id) => id !== userId);
      }
    },
    rollbackVoteThread: (state, action) => {
      const { threadId } = action.payload;
      const thread = state.list.find((t) => t.id === threadId);
      const rollback = state.voteRollbacks[threadId];
      if (thread && rollback) {
        thread.upVotesBy = rollback.upVotesBy;
        thread.downVotesBy = rollback.downVotesBy;
        delete state.voteRollbacks[threadId];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;

        const categorySet = new Set();
        action.payload.forEach((thread) => {
          if (thread.category && thread.category.trim()) {
            categorySet.add(toTitleCase(thread.category.trim()));
          }
        });
        state.categories = Array.from(categorySet).sort();
        const savedFilter = localStorage.getItem("df_filter");
        state.activeCategory = savedFilter || "ALL";
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        if (action.payload.category && action.payload.category.trim()) {
          const normalizedCategory = toTitleCase(action.payload.category.trim());
          if (!state.categories.includes(normalizedCategory)) {
            state.categories = [...state.categories, normalizedCategory].sort();
          }
        }
      })
      .addCase(createThread.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(voteThread.fulfilled, (state, action) => {
        const { threadId } = action.payload;
        delete state.voteRollbacks[threadId];
      })
      .addCase(voteThread.rejected, (state, action) => {
        const { threadId } = action.meta.arg;
        const thread = state.list.find((t) => t.id === threadId);
        const rollback = state.voteRollbacks[threadId];
        if (thread && rollback) {
          thread.upVotesBy = rollback.upVotesBy;
          thread.downVotesBy = rollback.downVotesBy;
          delete state.voteRollbacks[threadId];
        }
      });
  },
});

export const { setActiveCategory, optimisticVoteThread, rollbackVoteThread } = threadsSlice.actions;

export const fetchThreadsWithLoading = () => (dispatch) => {
  dispatch(pushLoading());
  const result = dispatch(fetchThreads());
  if (result && typeof result.then === "function") {
    result.finally(() => {
      dispatch(popLoading());
    });
    return result;
  }
  dispatch(popLoading());
  return result;
};

export const createThreadWithLoading = (payload) => (dispatch) => {
  dispatch(pushLoading());
  const result = dispatch(createThread(payload));
  if (result && typeof result.then === "function") {
    result.finally(() => {
      dispatch(popLoading());
    });
    return result;
  }
  dispatch(popLoading());
  return result;
};

export const voteThreadWithLoading =
  ({ threadId, type, userId }) =>
  (dispatch) => {
    dispatch(optimisticVoteThread({ threadId, type, userId }));
    dispatch(pushLoading());
    const result = dispatch(voteThread({ threadId, type }));
    if (result && typeof result.then === "function") {
      result.catch(() => {
        dispatch(rollbackVoteThread({ threadId }));
      });
      result.finally(() => {
        dispatch(popLoading());
      });
      return result;
    }
    dispatch(popLoading());
    return result;
  };

export default threadsSlice.reducer;
