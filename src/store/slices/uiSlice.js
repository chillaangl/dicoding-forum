import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    loadingCount: 0,
  },
  reducers: {
    pushLoading: (state) => {
      state.loadingCount += 1;
    },
    popLoading: (state) => {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
    },
  },
});

export const { pushLoading, popLoading } = uiSlice.actions;
export default uiSlice.reducer;
