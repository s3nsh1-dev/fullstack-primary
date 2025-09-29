import { useQuery } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useFetchCommentsOnTweets = (tweetId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["commentOnTweet", tweetId],

    queryFn: async () => {
      const response = await fetch(`${URL}/comments/t/${tweetId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING COMMENTS");
      const data: ApiResponse = await response.json();
      return data.data;
    },
    enabled,
  });
};
export default useFetchCommentsOnTweets;

export type TweetCommentType = {
  _id: string;
  content: string;
  tweet: string;
  owner: {
    _id: string;
    fullname: string;
    avatar: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
};

type ResponseData = {
  comments: {
    docs: TweetCommentType[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: string | null;
    nextPage: string | null;
  };
};

type ApiResponse = {
  statusCode: number;
  data: ResponseData;
  message: string;
  success: boolean;
};
