import { useQuery } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useFetchUserTweets = (user_ID: string) => {
  return useQuery({
    queryKey: ["userTweets", user_ID],
    queryFn: async () => {
      const response = await fetch(`${URL}/tweets/user/${user_ID}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING LIKED CONTENT");
      const data: UserTweetsAPIResponse = await response.json();
      const result = data.data.tweets;
      return result;
    },
    enabled: !!user_ID, // only fetch if user._id exists
    // staleTime: 10 * 60 * 1000, // 10min
  });
};
export default useFetchUserTweets;

interface UserTweetsAPIResponse {
  statusCode: number;
  data: {
    tweets: TweetType[];
  };
  message: string;
  success: boolean;
}

export interface TweetType {
  _id: string;
  content: string;
  owner: MinimalUserType; // MinimalUserType Id reference
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MinimalUserType {
  _id: string;
  fullname?: string;
  username?: string;
  avatar: string;
}
