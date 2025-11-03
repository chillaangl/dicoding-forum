import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/api";
import { pushLoading, popLoading } from "./uiSlice";

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/register", { name, email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", { email, password });
      const { token } = response.data.data;
      localStorage.setItem("df_token", token);
      return { token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const getMe = createAsyncThunk("auth/getMe", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/users/me");
    return response.data.data.user;
  } catch (error) {
    localStorage.removeItem("df_token");
    return rejectWithValue(error.response?.data?.message || "Failed to get user info");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("df_token"),
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("df_token");
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || String(action.payload || "Login failed");
      })
      .addCase(register.rejected, (state, action) => {
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || String(action.payload || "Registration failed");
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || String(action.payload || "Failed to get user info");
        state.token = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export const registerWithLoading = (payload) => (dispatch) => {
  dispatch(pushLoading());
  const result = dispatch(register(payload));
  if (result && typeof result.then === "function") {
    result.finally(() => {
      dispatch(popLoading());
    });
    return result;
  }
  dispatch(popLoading());
  return result;
};

export const loginWithLoading = (payload) => (dispatch) => {
  dispatch(pushLoading());
  const result = dispatch(login(payload));
  if (result && typeof result.then === "function") {
    result.finally(() => {
      dispatch(popLoading());
    });
    return result;
  }
  dispatch(popLoading());
  return result;
};

export const getMeWithLoading = () => (dispatch) => {
  dispatch(pushLoading());
  const result = dispatch(getMe());
  if (result && typeof result.then === "function") {
    result.finally(() => {
      dispatch(popLoading());
    });
    return result;
  }
  dispatch(popLoading());
  return result;
};

export default authSlice.reducer;
