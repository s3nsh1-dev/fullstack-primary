import { useMutation } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useUpdateComment = () => {
  return useMutation({
    mutationKey: ["updateComment"],
    mutationFn: async ({ commentId, content }: UpdateCommentInputType) => {
      const response = await fetch(`${URL}/comments/modify/${commentId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("ERROR WHILE UPDATING COMMENT");
      const result: UpdateCommentResponse = await response.json();
      return result;
    },
  });
};

export default useUpdateComment;

type UpdateCommentInputType = {
  commentId: string;
  content: string;
};

export type UpdateCommentResponse = {
  statusCode: number;
  data: {
    result: Result;
  };
  message: string;
  success: boolean;
};

type BaseResult = {
  _id: string;
  content: string;
  owner: {
    _id: string;
    fullname: string;
    avatar: string;
  };
  createdAt: string; // ISO
  updatedAt: string; // ISO
  __v: number;
};

// Union for the reference type makes sure only one type is allowed
type Result =
  | (BaseResult & { comment: string })
  | (BaseResult & { tweet: string })
  | (BaseResult & { video: string });
