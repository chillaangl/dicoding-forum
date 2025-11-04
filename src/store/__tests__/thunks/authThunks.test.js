import configureMockStore from "redux-mock-store";
import { login, getMe } from "../../slices/authSlice";
import api from "../../../lib/api";

jest.mock("axios");

const thunk = require("redux-thunk").thunk || require("redux-thunk");

const mockStore = configureMockStore([thunk]);

// Skenario pengujian: Menguji fungsi thunk untuk autentikasi seperti login dan getMe, memastikan aksi async seperti menyimpan token ke localStorage dan mendapatkan informasi user berjalan dengan benar dalam berbagai kondisi sukses dan error.
describe("authSlice thunks", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: null,
        token: null,
        error: null,
      },
    });
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should save token to localStorage and update state when login succeeds", async () => {
      const mockToken = "test-token-123";
      const axiosInstance = api;
      axiosInstance.post.mockResolvedValue({
        data: {
          data: {
            token: mockToken,
          },
        },
      });

      await store.dispatch(login({ email: "test@example.com", password: "password123" }));

      const actions = store.getActions();
      expect(actions[0].type).toBe("auth/login/pending");
      expect(actions[1].type).toBe("auth/login/fulfilled");
      expect(actions[1].payload.token).toBe(mockToken);
      expect(localStorage.getItem("df_token")).toBe(mockToken);
    });

    it("should handle login failure and set error", async () => {
      const errorMessage = "Invalid credentials";
      const axiosInstance = api;
      axiosInstance.post.mockRejectedValue({
        response: {
          data: {
            message: errorMessage,
          },
        },
      });

      await store.dispatch(login({ email: "test@example.com", password: "wrong" }));

      const actions = store.getActions();
      expect(actions[0].type).toBe("auth/login/pending");
      expect(actions[1].type).toBe("auth/login/rejected");
      expect(actions[1].payload).toBe(errorMessage);
      expect(localStorage.getItem("df_token")).toBeNull();
    });

    it("should handle login failure without response", async () => {
      const axiosInstance = api;
      axiosInstance.post.mockRejectedValue(new Error("Network error"));

      await store.dispatch(login({ email: "test@example.com", password: "password123" }));

      const actions = store.getActions();
      expect(actions[1].type).toBe("auth/login/rejected");
      expect(actions[1].payload).toBe("Login failed");
    });
  });

  describe("getMe", () => {
    it("should fetch user info and update state when succeeds", async () => {
      const mockUser = {
        id: "u1",
        name: "Alice",
        email: "alice@example.com",
        avatar: "",
      };
      const axiosInstance = api;
      axiosInstance.get.mockResolvedValue({
        data: {
          data: {
            user: mockUser,
          },
        },
      });

      await store.dispatch(getMe());

      const actions = store.getActions();
      expect(actions[0].type).toBe("auth/getMe/pending");
      expect(actions[1].type).toBe("auth/getMe/fulfilled");
      expect(actions[1].payload).toEqual(mockUser);
    });

    it("should handle getMe failure and remove token", async () => {
      const errorMessage = "Unauthorized";
      localStorage.setItem("df_token", "existing-token");
      const axiosInstance = api;
      axiosInstance.get.mockRejectedValue({
        response: {
          data: {
            message: errorMessage,
          },
        },
      });

      await store.dispatch(getMe());

      const actions = store.getActions();
      expect(actions[0].type).toBe("auth/getMe/pending");
      expect(actions[1].type).toBe("auth/getMe/rejected");
      expect(actions[1].payload).toBe(errorMessage);
      expect(localStorage.getItem("df_token")).toBeNull();
    });

    it("should handle getMe failure without response", async () => {
      const axiosInstance = api;
      axiosInstance.get.mockRejectedValue(new Error("Network error"));

      await store.dispatch(getMe());

      const actions = store.getActions();
      expect(actions[1].type).toBe("auth/getMe/rejected");
      expect(actions[1].payload).toBe("Failed to get user info");
    });
  });
});
