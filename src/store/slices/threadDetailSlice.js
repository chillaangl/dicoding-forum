import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/api";
import { pushLoading, popLoading } from "./uiSlice";

export const fetchThreadDetail = createAsyncThunk(
  "threadDetail/fetchThreadDetail",
  async (threadId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/threads/${threadId}`);
      return response.data.data.detailThread;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch thread detail");
    }
  },
);

export const createComment = createAsyncThunk(
  "threadDetail/createComment",
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/threads/${threadId}/comments`, {
        content,
      });
      return response.data.data.comment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create comment");
    }
  },
);

export const voteThreadDetail = createAsyncThunk(
  "threadDetail/voteThreadDetail",
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

export const voteComment = createAsyncThunk(
  "threadDetail/voteComment",
  async ({ threadId, commentId, type }, { rejectWithValue }) => {
    try {
      let endpoint = "";
      if (type === "up") {
        endpoint = `/threads/${threadId}/comments/${commentId}/up-vote`;
      } else if (type === "down") {
        endpoint = `/threads/${threadId}/comments/${commentId}/down-vote`;
      } else {
        endpoint = `/threads/${threadId}/comments/${commentId}/neutral-vote`;
      }
      await api.post(endpoint);
      return { threadId, commentId, type };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to vote comment");
    }
  },
);

const threadDetailSlice = createSlice({
  name: "threadDetail",
  initialState: {
    data: null,
    error: null,
    voteRollbacks: {},
  },
  reducers: {
    clearThread: (state) => {
      state.data = null;
      state.error = null;
      state.voteRollbacks = {};
    },
    optimisticVoteThreadDetail: (state, action) => {
      const { type, userId } = action.payload;
      if (!state.data) return;

      const prevUpVotes = [...(state.data.upVotesBy || [])];
      const prevDownVotes = [...(state.data.downVotesBy || [])];

      state.voteRollbacks.thread = {
        upVotesBy: prevUpVotes,
        downVotesBy: prevDownVotes,
      };

      if (type === "up") {
        state.data.upVotesBy = state.data.upVotesBy || [];
        state.data.downVotesBy = state.data.downVotesBy || [];
        if (!state.data.upVotesBy.includes(userId)) {
          state.data.upVotesBy.push(userId);
        }
        state.data.downVotesBy = state.data.downVotesBy.filter((id) => id !== userId);
      } else if (type === "down") {
        state.data.upVotesBy = state.data.upVotesBy || [];
        state.data.downVotesBy = state.data.downVotesBy || [];
        state.data.upVotesBy = state.data.upVotesBy.filter((id) => id !== userId);
        if (!state.data.downVotesBy.includes(userId)) {
          state.data.downVotesBy.push(userId);
        }
      } else {
        state.data.upVotesBy = (state.data.upVotesBy || []).filter((id) => id !== userId);
        state.data.downVotesBy = (state.data.downVotesBy || []).filter((id) => id !== userId);
      }
    },
    optimisticVoteComment: (state, action) => {
      const { commentId, type, userId } = action.payload;
      if (!state.data || !state.data.comments) return;

      const comment = state.data.comments.find((c) => c.id === commentId);
      if (!comment) return;

      const prevUpVotes = [...(comment.upVotesBy || [])];
      const prevDownVotes = [...(comment.downVotesBy || [])];

      state.voteRollbacks[commentId] = {
        upVotesBy: prevUpVotes,
        downVotesBy: prevDownVotes,
      };

      if (type === "up") {
        comment.upVotesBy = comment.upVotesBy || [];
        comment.downVotesBy = comment.downVotesBy || [];
        if (!comment.upVotesBy.includes(userId)) {
          comment.upVotesBy.push(userId);
        }
        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      } else if (type === "down") {
        comment.upVotesBy = comment.upVotesBy || [];
        comment.downVotesBy = comment.downVotesBy || [];
        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
        if (!comment.downVotesBy.includes(userId)) {
          comment.downVotesBy.push(userId);
        }
      } else {
        comment.upVotesBy = (comment.upVotesBy || []).filter((id) => id !== userId);
        comment.downVotesBy = (comment.downVotesBy || []).filter((id) => id !== userId);
      }
    },
    rollbackVoteThreadDetail: (state) => {
      if (!state.data || !state.voteRollbacks.thread) return;
      const rollback = state.voteRollbacks.thread;
      state.data.upVotesBy = rollback.upVotesBy;
      state.data.downVotesBy = rollback.downVotesBy;
      delete state.voteRollbacks.thread;
    },
    rollbackVoteComment: (state, action) => {
      const { commentId } = action.payload;
      if (!state.data || !state.data.comments) return;
      const comment = state.data.comments.find((c) => c.id === commentId);
      const rollback = state.voteRollbacks[commentId];
      if (comment && rollback) {
        comment.upVotesBy = rollback.upVotesBy;
        comment.downVotesBy = rollback.downVotesBy;
        delete state.voteRollbacks[commentId];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = null;
        state.voteRollbacks = {};
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        if (state.data && state.data.comments) {
          state.data.comments = [action.payload, ...state.data.comments];
        } else if (state.data) {
          state.data.comments = [action.payload];
        }
      })
      .addCase(voteThreadDetail.fulfilled, () => {})
      .addCase(voteThreadDetail.rejected, (state) => {
        const rollback = state.voteRollbacks.thread;
        if (state.data && rollback) {
          state.data.upVotesBy = rollback.upVotesBy;
          state.data.downVotesBy = rollback.downVotesBy;
          delete state.voteRollbacks.thread;
        }
      })
      .addCase(voteComment.fulfilled, (state, action) => {
        const { commentId } = action.payload;
        delete state.voteRollbacks[commentId];
      })
      .addCase(voteComment.rejected, (state, action) => {
        const { commentId } = action.meta.arg;
        if (!state.data || !state.data.comments) return;
        const comment = state.data.comments.find((c) => c.id === commentId);
        const rollback = state.voteRollbacks[commentId];
        if (comment && rollback) {
          comment.upVotesBy = rollback.upVotesBy;
          comment.downVotesBy = rollback.downVotesBy;
          delete state.voteRollbacks[commentId];
        }
      });
  },
});

export const {
  clearThread,
  optimisticVoteThreadDetail,
  optimisticVoteComment,
  rollbackVoteThreadDetail,
  rollbackVoteComment,
} = threadDetailSlice.actions;

export const fetchThreadDetailWithLoading = (threadId) => (dispatch) => {
  dispatch(pushLoading());
  const result = dispatch(fetchThreadDetail(threadId));
  if (result && typeof result.then === "function") {
    result.finally(() => {
      dispatch(popLoading());
    });
    return result;
  }
  dispatch(popLoading());
  return result;
};

export const createCommentWithLoading = (payload) => (dispatch) => {
  dispatch(pushLoading());
  const result = dispatch(createComment(payload));
  if (result && typeof result.then === "function") {
    result.finally(() => {
      dispatch(popLoading());
    });
    return result;
  }
  dispatch(popLoading());
  return result;
};

export const voteThreadDetailWithLoading =
  ({ threadId, type, userId }) =>
  (dispatch) => {
    dispatch(optimisticVoteThreadDetail({ type, userId }));
    dispatch(pushLoading());
    const result = dispatch(voteThreadDetail({ threadId, type }));
    if (result && typeof result.then === "function") {
      result.catch(() => {
        dispatch(rollbackVoteThreadDetail());
      });
      result.finally(() => {
        dispatch(popLoading());
      });
      return result;
    }
    dispatch(popLoading());
    return result;
  };

export const voteCommentWithLoading =
  ({ threadId, commentId, type, userId }) =>
  (dispatch) => {
    dispatch(optimisticVoteComment({ commentId, type, userId }));
    dispatch(pushLoading());
    const result = dispatch(voteComment({ threadId, commentId, type }));
    if (result && typeof result.then === "function") {
      result.catch(() => {
        dispatch(rollbackVoteComment({ commentId }));
      });
      result.finally(() => {
        dispatch(popLoading());
      });
      return result;
    }
    dispatch(popLoading());
    return result;
  };

export default threadDetailSlice.reducer;
