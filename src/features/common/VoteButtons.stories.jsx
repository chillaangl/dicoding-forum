import VoteButtons from "./VoteButtons";

export default {
  title: "Components/VoteButtons",
  component: VoteButtons,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "20px" }}>
        <Story />
      </div>
    ),
  ],
};

export const Default = {
  args: {
    threadId: "thread-1",
    upVotesBy: [],
    downVotesBy: [],
    isDetailPage: false,
  },
};

export const WithVotes = {
  args: {
    threadId: "thread-1",
    upVotesBy: ["user-1", "user-2", "user-3"],
    downVotesBy: ["user-4"],
    isDetailPage: false,
  },
};

export const Upvoted = {
  args: {
    threadId: "thread-1",
    upVotesBy: ["user-1"],
    downVotesBy: [],
    isDetailPage: false,
  },
  parameters: {
    // This simulates logged-in user with ID "user-1"
    // In real app, this would come from Redux store
    docs: {
      description: {
        story: "State when current user (user-1) has upvoted this thread.",
      },
    },
  },
};

export const Downvoted = {
  args: {
    threadId: "thread-1",
    upVotesBy: [],
    downVotesBy: ["user-1"],
    isDetailPage: false,
  },
  parameters: {
    docs: {
      description: {
        story: "State when current user (user-1) has downvoted this thread.",
      },
    },
  },
};

export const Neutral = {
  args: {
    threadId: "thread-1",
    upVotesBy: ["user-2", "user-3"],
    downVotesBy: ["user-4"],
    isDetailPage: false,
  },
  parameters: {
    docs: {
      description: {
        story: "State when current user has not voted (neutral).",
      },
    },
  },
};

export const CommentVote = {
  args: {
    threadId: "thread-1",
    commentId: "comment-1",
    upVotesBy: ["user-1"],
    downVotesBy: [],
    isDetailPage: false,
  },
  parameters: {
    docs: {
      description: {
        story: "VoteButtons used for comments (commentId provided).",
      },
    },
  },
};

export const DetailPage = {
  args: {
    threadId: "thread-1",
    upVotesBy: ["user-1", "user-2"],
    downVotesBy: [],
    isDetailPage: true,
  },
  parameters: {
    docs: {
      description: {
        story: "VoteButtons on thread detail page.",
      },
    },
  },
};
