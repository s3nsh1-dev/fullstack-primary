import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_SERVER_URL;

const useFetchUserTweets = ({ userId, page, limit }: ParamTypes) => {
  return useQuery({
    queryKey: ["userTweets", userId],
    queryFn: async () => {
      const { data } = await axios<TweetApiResponse>({
        url: `${URL}/tweets/user/${userId}?page=${page}&limit=${limit}`,
        method: "get",
        withCredentials: true,
      });
      return data.data;
    },
    enabled: !!userId, // only fetch if user._id exists
  });
};
export default useFetchUserTweets;

interface TweetOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
}

interface UserTweet {
  _id: string;
  content: string;
  owner: TweetOwner;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
}

interface PaginationData {
  tweets: UserTweet[];
  totalTweets: number;
  totalPages: number;
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
