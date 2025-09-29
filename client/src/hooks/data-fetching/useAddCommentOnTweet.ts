import { useMutation } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useAddCommentOnTweet = () => {
  return useMutation({
    mutationKey: ["addCommentOnTweet"],
    mutationFn: async ({ content, tweet_ID }: InputType) => {
      const response = await fetch(`${URL}/comments/t/${tweet_ID}`, {
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

export default useAddCommentOnTweet;

type InputType = {
  content: string;
  tweet_ID: string;
};
