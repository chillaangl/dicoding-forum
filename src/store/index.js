import { configureStore } from "@reduxjs/toolkit";
import auth, { getMeWithLoading } from "./slices/authSlice";
import users, { fetchUsersWithLoading } from "./slices/usersSlice";
import threads, { fetchThreadsWithLoading } from "./slices/threadsSlice";
import threadDetail from "./slices/threadDetailSlice";
import leaderboard, { fetchLeaderboardWithLoading } from "./slices/leaderboardSlice";
import ui from "./slices/uiSlice";

const store = configureStore({
  reducer: { auth, users, threads, threadDetail, leaderboard, ui },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export const bootstrapSession = (storeInstance) => {
  const token = localStorage.getItem("df_token");
  if (token) {
    storeInstance.dispatch(getMeWithLoading());
  }
  storeInstance.dispatch(fetchUsersWithLoading());
  storeInstance.dispatch(fetchThreadsWithLoading());
  storeInstance.dispatch(fetchLeaderboardWithLoading());
};

export default store;
