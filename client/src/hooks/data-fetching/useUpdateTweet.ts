import { useMutation } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useUpdateTweet = () => {
  return useMutation({
    mutationKey: ["updateTweet"],
    mutationFn: async ({ tweetId, content }: UpdateTweetInputType) => {
      const response = await fetch(`${URL}/tweets/${tweetId}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("ERROR WHILE UPDATING TWEET");
      const result = await response.json();
      return result;
    },
  });
};

export default useUpdateTweet;

type UpdateTweetInputType = {
  tweetId: string;
  content: string;
};
