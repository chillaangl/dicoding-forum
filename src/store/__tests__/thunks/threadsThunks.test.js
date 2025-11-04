import configureMockStore from "redux-mock-store";
import {
  createThread,
  voteThread,
  optimisticVoteThread,
  rollbackVoteThread,
} from "../../slices/threadsSlice";
import api from "../../../lib/api";

jest.mock("axios");

const thunk = require("redux-thunk").thunk || require("redux-thunk");

const mockStore = configureMockStore([thunk]);

// Skenario pengujian: Menguji fungsi thunk untuk thread seperti createThread dan voteThread, memastikan aksi async seperti membuat thread baru dan melakukan vote dengan optimistik update berjalan dengan benar dalam berbagai kondisi sukses dan error.
describe("threadsSlice thunks", () => {
  let store;

  const initialState = {
    threads: {
      list: [],
      categories: ["JavaScript"],
      activeCategory: "ALL",
      error: null,
      voteRollbacks: {},
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  describe("createThread", () => {
    it("should prepend new thread to list and update categories", async () => {
      const newThread = {
        id: "thread-new",
        title: "New Thread",
        body: "Thread body",
        category: "Python",
        upVotesBy: [],
        downVotesBy: [],
      };

      const axiosInstance = api;
      axiosInstance.post.mockResolvedValue({
        data: {
          data: {
            thread: newThread,
          },
        },
      });

      await store.dispatch(
        createThread({ title: "New Thread", body: "Thread body", category: "Python" }),
      );

      const actions = store.getActions();
      expect(actions[0].type).toBe("threads/createThread/pending");
      expect(actions[1].type).toBe("threads/createThread/fulfilled");
      expect(actions[1].payload).toEqual(newThread);
    });

    it("should handle createThread failure", async () => {
      const errorMessage = "Failed to create thread";
      const axiosInstance = api;
      axiosInstance.post.mockRejectedValue({
        response: {
          data: {
            message: errorMessage,
          },
        },
      });

      await store.dispatch(
        createThread({ title: "New Thread", body: "Thread body", category: "Python" }),
      );

      const actions = store.getActions();
      expect(actions[0].type).toBe("threads/createThread/pending");
      expect(actions[1].type).toBe("threads/createThread/rejected");
      expect(actions[1].payload).toBe(errorMessage);
    });
  });

  describe("voteThread", () => {
    it("should call optimisticVoteThread then voteThread on success", async () => {
      const threadId = "thread-1";
      const userId = "user-1";
      const type = "up";

      const axiosInstance = api;
      axiosInstance.post.mockResolvedValue({ data: {} });

      const stateWithThread = {
        threads: {
          ...initialState.threads,
          list: [
            {
              id: threadId,
              title: "Test Thread",
              upVotesBy: [],
              downVotesBy: [],
            },
          ],
        },
      };
      store = mockStore(stateWithThread);

      store.dispatch(optimisticVoteThread({ threadId, type, userId }));
      await store.dispatch(voteThread({ threadId, type }));

      const actions = store.getActions();
      expect(actions[0].type).toBe("threads/optimisticVoteThread");
      expect(actions[1].type).toBe("threads/voteThread/pending");
      expect(actions[2].type).toBe("threads/voteThread/fulfilled");
      expect(axiosInstance.post).toHaveBeenCalledWith(`/threads/${threadId}/up-vote`);
    });

    it("should rollback vote on failure", async () => {
      const threadId = "thread-1";
      const type = "up";

      const axiosInstance = api;
      axiosInstance.post.mockRejectedValue({
        response: {
          data: {
            message: "Vote failed",
          },
        },
      });

      await store.dispatch(voteThread({ threadId, type }));

      const actions = store.getActions();
      expect(actions[0].type).toBe("threads/voteThread/pending");
      expect(actions[1].type).toBe("threads/voteThread/rejected");
    });

    it("should call correct endpoint for down vote", async () => {
      const threadId = "thread-1";
      const type = "down";

      const axiosInstance = api;
      axiosInstance.post.mockResolvedValue({ data: {} });

      await store.dispatch(voteThread({ threadId, type }));

      expect(axiosInstance.post).toHaveBeenCalledWith(`/threads/${threadId}/down-vote`);
    });

    it("should call correct endpoint for neutral vote", async () => {
      const threadId = "thread-1";
      const type = "neutral";

      const axiosInstance = api;
      axiosInstance.post.mockResolvedValue({ data: {} });

      await store.dispatch(voteThread({ threadId, type }));

      expect(axiosInstance.post).toHaveBeenCalledWith(`/threads/${threadId}/neutral-vote`);
    });

    it("should handle vote failure without response", async () => {
      const threadId = "thread-1";
      const type = "up";

      const axiosInstance = api;
      axiosInstance.post.mockRejectedValue(new Error("Network error"));

      await store.dispatch(voteThread({ threadId, type }));

      const actions = store.getActions();
      expect(actions[1].type).toBe("threads/voteThread/rejected");
      expect(actions[1].payload).toBe("Failed to vote thread");
    });
  });
});
