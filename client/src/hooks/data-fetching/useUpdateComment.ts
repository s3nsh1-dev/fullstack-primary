import { useMutation } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useUpdateComment = () => {
  return useMutation({
    mutationKey: ["updateComment"],
    mutationFn: async ({ commentId, content }: UpdateCommentInputType) => {
      const response = await fetch(`${URL}/comments/c/${commentId}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("ERROR WHILE UPDATING COMMENT");
      const result = await response.json();
      return result;
    },
  });
};

export default useUpdateComment;

type UpdateCommentInputType = {
  commentId: string;
  content: string;
};
