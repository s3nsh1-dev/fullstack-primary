import { useQuery } from "@tanstack/react-query";
import type { TweetType } from "./useFetchUserTweets";

const URL = import.meta.env.VITE_SERVER_URL;

const useFetchSingleTweet = ({ tweetId, userId }: ParamTypes) => {
  return useQuery({
    queryKey: ["singleTweet", tweetId],
    queryFn: async () => {
      const response = await fetch(
        `${URL}/tweets/${tweetId}?userId=${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("ERROR WHILE FETCHING TWEET");
      const data: UserTweetsAPIResponse = await response.json();
      const result = data?.data;
      return result;
    },
    enabled: !!tweetId,
  });
};

export default useFetchSingleTweet;

interface UserTweetsAPIResponse {
  statusCode: number;
  data: {
    tweet: TweetType;
    isLiked: boolean;
  };
  message: string;
  success: boolean;
}
type ParamTypes = {
  tweetId: string;
  userId: string;
};
