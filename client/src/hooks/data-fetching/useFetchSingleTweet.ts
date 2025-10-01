import { useQuery } from "@tanstack/react-query";
import type { TweetType } from "./useFetchUserTweets";

const URL = import.meta.env.VITE_SERVER_URL;

const useFetchSingleTweet = (tweetId: string) => {
  return useQuery({
    queryKey: ["singleTweet", tweetId],
    queryFn: async () => {
      const response = await fetch(`${URL}/tweets/${tweetId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING TWEET");
      const data: UserTweetsAPIResponse = await response.json();
      const result = await data.data?.tweet;
      if (!result) throw new Error("TWEET NOT FOUND");
      return result;
    },
    enabled: !!tweetId,
    staleTime: 10 * 60 * 1000,
  });
};

export default useFetchSingleTweet;

interface UserTweetsAPIResponse {
  statusCode: number;
  data: {
    tweet: TweetType;
  };
  message: string;
  success: boolean;
}
