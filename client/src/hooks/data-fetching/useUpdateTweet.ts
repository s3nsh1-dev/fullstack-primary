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
      const result: UpdateTweetResponse = await response.json();
      return result;
    },
  });
};

export default useUpdateTweet;

type UpdateTweetInputType = {
  tweetId: string;
  content: string;
};

export type UpdateTweetResponse = {
  statusCode: number;
  data: {
    tweet: {
      _id: string;
      owner: {
        _id: string;
        username: string;
        fullname: string;
        avatar: string;
      };
      createdAt: string; // ISO string
      updatedAt: string; // ISO string
      content: string;
    };
  };
  message: string;
  success: boolean;
};
