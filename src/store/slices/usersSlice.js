import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/api";
import { pushLoading, popLoading } from "./uiSlice";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/users");
    return response.data.data.users;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const fetchUsersWithLoading = () => (dispatch) => {
  dispatch(pushLoading());
  const result = dispatch(fetchUsers());
  if (result && typeof result.then === "function") {
    result.finally(() => {
      dispatch(popLoading());
    });
    return result;
  }
  dispatch(popLoading());
  return result;
};

export default usersSlice.reducer;
