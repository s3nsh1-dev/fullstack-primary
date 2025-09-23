import { useMutation } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useFetchCommentsOnTweets = () => {
  return useMutation({
    mutationKey: ["commentOnTweet"],
    mutationFn: async (tweet_ID: string) => {
      const response = await fetch(`${URL}/comments/t/${tweet_ID}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING COMMENTS");
      const data: ApiResponse = await response.json();
      console.log(data.data.comments);
      return data.data;
    },
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
