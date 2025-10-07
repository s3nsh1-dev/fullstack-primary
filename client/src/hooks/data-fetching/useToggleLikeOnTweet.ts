import { useMutation } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useToggleLikeOnTweet = () => {
  return useMutation({
    mutationKey: ["likeTweet"],
    mutationFn: async (tweet_ID: string) => {
      const response = await fetch(`${URL}/likes/toggle/t/${tweet_ID}`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING TWEET LIKES");
      const data: ApiResponse<LikeAddedResponse | LikeRemovedResponse> =
        await response.json();
      return data.data.result;
    },
  });
};

export default useToggleLikeOnTweet;

export type LikeRemovedResponse = {
  result: {
    acknowledged: boolean;
    deletedCount: number;
  };
};
export type LikeAddedResponse = {
  result: {
    tweet: string; // tweet ID
    likedBy: string; // user ID
    _id: string; // like record ID
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
  };
};

type ApiResponse<T> = {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
};
