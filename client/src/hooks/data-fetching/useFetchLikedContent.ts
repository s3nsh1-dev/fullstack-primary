import { useQuery } from "@tanstack/react-query";
import type { LikedContentResponseType } from "../../constants/responseTypes";

const useFetchLikedContent = (user_ID: string) => {
  return useQuery({
    queryKey: ["likedContent", user_ID],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/likes/content/${user_ID}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("ERROR WHILE FETCHING LIKED CONTENT");
      const data: LikedContentResponseType = await response.json();
      const result = data.data.likes;
      return result;
    },
    enabled: !!user_ID, // only fetch if user._id exists
    staleTime: 10 * 60 * 1000, // 10min
  });
};

export default useFetchLikedContent;

interface User {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
}

interface Tweet {
  _id: string;
  content: string;
  owner: User;
  updatedAt: string;
}

interface LikedTweet {
  _id: string;
  tweet: Tweet;
  likedBy: string;
  updatedAt: string;
}

// Usage
export type ApiResponse = LikedTweet;
