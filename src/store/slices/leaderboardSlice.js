import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/api";
import { pushLoading, popLoading } from "./uiSlice";

export const fetchLeaderboard = createAsyncThunk(
  "leaderboard/fetchLeaderboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/leaderboards");
      return response.data.data.leaderboards;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch leaderboard");
    }
  },
);

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
    list: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const fetchLeaderboardWithLoading = () => (dispatch) => {
  dispatch(pushLoading());
  const result = dispatch(fetchLeaderboard());
  if (result && typeof result.then === "function") {
    result.finally(() => {
      dispatch(popLoading());
    });
    return result;
  }
  dispatch(popLoading());
  return result;
};

export default leaderboardSlice.reducer;
