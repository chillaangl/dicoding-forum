import { screen, fireEvent, waitFor, renderWithProviders } from "../../../test-utils";
import VoteButtons from "../../common/VoteButtons";
import { voteThreadWithLoading } from "../../../store/slices/threadsSlice";
import {
  voteThreadDetailWithLoading,
  voteCommentWithLoading,
} from "../../../store/slices/threadDetailSlice";

jest.mock("axios");

jest.mock("../../../store/slices/threadsSlice", () => ({
  ...jest.requireActual("../../../store/slices/threadsSlice"),
  voteThreadWithLoading: jest.fn(() => ({
    type: "voteThreadWithLoading",
    unwrap: () => Promise.resolve(),
  })),
}));

jest.mock("../../../store/slices/threadDetailSlice", () => ({
  ...jest.requireActual("../../../store/slices/threadDetailSlice"),
  voteThreadDetailWithLoading: jest.fn(() => ({
    type: "voteThreadDetailWithLoading",
    unwrap: () => Promise.resolve(),
  })),
  voteCommentWithLoading: jest.fn(() => ({
    type: "voteCommentWithLoading",
    unwrap: () => Promise.resolve(),
  })),
}));

// Skenario pengujian: Menguji komponen VoteButtons untuk memastikan tombol vote berfungsi dengan benar, termasuk menampilkan jumlah vote, menangani klik vote untuk thread dan komentar, serta menampilkan state disabled ketika user belum login.
describe("VoteButtons", () => {
  const defaultProps = {
    threadId: "thread-1",
    upVotesBy: [],
    downVotesBy: [],
  };

  describe("when user is logged in", () => {
    const preloadedState = {
      auth: {
        user: { id: "user-1", name: "Test User" },
        token: "test-token",
        error: null,
      },
      ui: {
        loadingCount: 0,
      },
    };

    it("should render upvote and downvote counts", () => {
      renderWithProviders(
        <VoteButtons {...defaultProps} upVotesBy={["u1", "u2"]} downVotesBy={["u3"]} />,
        {
          preloadedState,
        },
      );

      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should dispatch voteThreadWithLoading when clicking upvote button", async () => {
      const { store } = renderWithProviders(<VoteButtons {...defaultProps} />, { preloadedState });

      const upButton = screen.getByLabelText("Upvote");
      fireEvent.click(upButton);

      await waitFor(() => {
        expect(voteThreadWithLoading).toHaveBeenCalledWith({
          threadId: "thread-1",
          type: "up",
          userId: "user-1",
        });
      });
    });

    it("should dispatch voteThreadWithLoading when clicking downvote button", async () => {
      renderWithProviders(<VoteButtons {...defaultProps} />, { preloadedState });

      const downButton = screen.getByLabelText("Downvote");
      fireEvent.click(downButton);

      await waitFor(() => {
        expect(voteThreadWithLoading).toHaveBeenCalledWith({
          threadId: "thread-1",
          type: "down",
          userId: "user-1",
        });
      });
    });

    it("should dispatch voteThreadDetailWithLoading when isDetailPage is true", async () => {
      renderWithProviders(<VoteButtons {...defaultProps} isDetailPage />, { preloadedState });

      const upButton = screen.getByLabelText("Upvote");
      fireEvent.click(upButton);

      await waitFor(() => {
        expect(voteThreadDetailWithLoading).toHaveBeenCalledWith({
          threadId: "thread-1",
          type: "up",
          userId: "user-1",
        });
      });
    });

    it("should dispatch voteCommentWithLoading when commentId is provided", async () => {
      renderWithProviders(<VoteButtons {...defaultProps} commentId="comment-1" />, {
        preloadedState,
      });

      const upButton = screen.getByLabelText("Upvote");
      fireEvent.click(upButton);

      await waitFor(() => {
        expect(voteCommentWithLoading).toHaveBeenCalledWith({
          threadId: "thread-1",
          commentId: "comment-1",
          type: "up",
          userId: "user-1",
        });
      });
    });

    it("should show upvoted state when user has upvoted", () => {
      renderWithProviders(
        <VoteButtons {...defaultProps} upVotesBy={["user-1"]} downVotesBy={[]} />,
        { preloadedState },
      );

      const upButton = screen.getByLabelText("Upvote");
      expect(upButton).toHaveAttribute("aria-pressed", "true");
    });

    it("should show downvoted state when user has downvoted", () => {
      renderWithProviders(
        <VoteButtons {...defaultProps} upVotesBy={[]} downVotesBy={["user-1"]} />,
        { preloadedState },
      );

      const downButton = screen.getByLabelText("Downvote");
      expect(downButton).toHaveAttribute("aria-pressed", "true");
    });

    it("should toggle to neutral when clicking upvote on already upvoted thread", async () => {
      renderWithProviders(
        <VoteButtons {...defaultProps} upVotesBy={["user-1"]} downVotesBy={[]} />,
        { preloadedState },
      );

      const upButton = screen.getByLabelText("Upvote");
      fireEvent.click(upButton);

      await waitFor(() => {
        expect(voteThreadWithLoading).toHaveBeenCalledWith({
          threadId: "thread-1",
          type: "neutral",
          userId: "user-1",
        });
      });
    });
  });

  describe("when user is not logged in", () => {
    const preloadedState = {
      auth: {
        user: null,
        token: null,
        error: null,
      },
      ui: {
        loadingCount: 0,
      },
    };

    it("should render disabled buttons with tooltip", () => {
      renderWithProviders(<VoteButtons {...defaultProps} />, { preloadedState });

      const upButton = screen.getByLabelText("Upvote (login required)");
      const downButton = screen.getByLabelText("Downvote (login required)");

      expect(upButton).toBeDisabled();
      expect(downButton).toBeDisabled();
      expect(upButton).toHaveAttribute("title", "Login untuk vote");
    });

    it("should not dispatch vote action when clicking disabled buttons", () => {
      renderWithProviders(<VoteButtons {...defaultProps} />, { preloadedState });

      const upButton = screen.getByLabelText("Upvote (login required)");
      fireEvent.click(upButton);

      expect(voteThreadWithLoading).not.toHaveBeenCalled();
    });
  });
});
