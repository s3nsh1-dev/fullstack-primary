import { useMutation } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useAddCommentOnComment = () => {
  return useMutation({
    mutationKey: ["addCommentOnComment"],
    mutationFn: async ({ content, comment_ID }: InputType) => {
      const response = await fetch(`${URL}/comments/c/${comment_ID}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING COMMENTS");
      const data = await response.json();
      return data.data;
    },
  });
};

export default useAddCommentOnComment;

type InputType = {
  content: string;
  comment_ID: string;
};
