// src/test-utils.jsx
import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";

// Import reducer menggunakan requireActual untuk memastikan selalu mendapatkan reducer asli
// bahkan ketika ada mock di test files
const getActualReducers = () => {
  const authSlice = jest.requireActual("./store/slices/authSlice");
  const usersSlice = jest.requireActual("./store/slices/usersSlice");
  const threadsSlice = jest.requireActual("./store/slices/threadsSlice");
  const threadDetailSlice = jest.requireActual("./store/slices/threadDetailSlice");
  const leaderboardSlice = jest.requireActual("./store/slices/leaderboardSlice");
  const uiSlice = jest.requireActual("./store/slices/uiSlice");

  return {
    auth: authSlice.default,
    users: usersSlice.default,
    threads: threadsSlice.default,
    threadDetail: threadDetailSlice.default,
    leaderboard: leaderboardSlice.default,
    ui: uiSlice.default,
  };
};

export function makeStore(preloadedState = {}) {
  // Reducer map PERSIS sama seperti di store/index.js
  // Selalu gunakan actual reducers untuk menghindari masalah dengan mocks
  const rootReducer = getActualReducers();

  // Build store config
  const storeConfig = {
    reducer: rootReducer,
    middleware: (getDefault) => getDefault({ serializableCheck: false }),
  };

  // Hanya tambahkan preloadedState jika ada data yang diberikan DAN reducer valid
  if (preloadedState && Object.keys(preloadedState).length > 0) {
    const finalPreloadedState = {};
    // Pastikan hanya keys yang ada di rootReducer yang ditambahkan
    Object.keys(rootReducer).forEach((key) => {
      if (preloadedState[key] !== undefined && rootReducer[key]) {
        finalPreloadedState[key] = preloadedState[key];
      }
    });
    if (Object.keys(finalPreloadedState).length > 0) {
      storeConfig.preloadedState = finalPreloadedState;
    }
  }

  return configureStore(storeConfig);
}

export function renderWithProviders(
  ui,
  { preloadedState, store = makeStore(preloadedState), route = "/", ...renderOptions } = {},
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from "@testing-library/react";
