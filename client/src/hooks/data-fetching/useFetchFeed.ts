import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchFeed = (limit: number) => {
  return useInfiniteQuery({
    queryKey: ["feed", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios<ApiResponse>({
        url: `${URL}/feeds?page=${pageParam}&limit=${limit}`,
        method: "get",
      });
      return data.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

export default useFetchFeed;

const URL = import.meta.env.VITE_SERVER_URL;
export interface ContentOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
}

export interface TweetItem {
  _id: string;
  content: string;
  owner: ContentOwner;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface VideoItem {
  _id: string;
  owner: ContentOwner;
  videoFile: string;
  videoPublicId: string;
  thumbnail: string;
  thumbPublicId: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type FeedItem = TweetItem | VideoItem;

interface FeedPaginationData {
  feed: FeedItem[];
  feedLen: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
}
interface ApiResponse {
  statusCode: number;
  data: FeedPaginationData;
  message: string;
  success: boolean;
}
