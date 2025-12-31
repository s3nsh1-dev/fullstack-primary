import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchUserTweets = ({ userId, page, limit }: ParamTypes) => {
  return useQuery({
    queryKey: ["userTweets", userId, page, limit],
    queryFn: async () => {
      const { data } = await axios<TweetApiResponse>({
        url: `${URL}/tweets/user/${userId}?page=${page}&limit=${limit}`,
        method: "get",
        withCredentials: true,
      });
      return data.data;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
};
export default useFetchUserTweets;

interface TweetOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
}

export interface TweetType {
  _id: string;
  content: string;
  owner: TweetOwner;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
}

interface PaginationData {
  tweets: TweetType[];
  totalTweets: number;
  totalPages: number;
  hasNextPage: boolean;
  havePrevPage: boolean;
  currentPage: number;
  limit: number;
}

interface TweetApiResponse {
  statusCode: number;
  data: PaginationData;
  message: string;
  success: boolean;
}
type ParamTypes = {
  userId: string;
  page: number;
  limit: number;
};

const URL = import.meta.env.VITE_SERVER_URL;
