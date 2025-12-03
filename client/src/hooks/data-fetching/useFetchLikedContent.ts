import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchLikedContent = ({ userId, limit }: HookParams) => {
  return useInfiniteQuery({
    queryKey: ["likedContent", userId],
    queryFn: async ({ pageParam }: FuncParams) => {
      const { data } = await axios<ApiResponse>({
        url: `${URL}/likes/content/${userId}?page=${pageParam}&limit=${limit}`,
        method: "get",
        withCredentials: true,
      });
      return data.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.hasPrevPage ? firstPage.currentPage - 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export default useFetchLikedContent;

const URL = import.meta.env.VITE_SERVER_URL;

type HookParams = {
  userId: string;
  limit: number;
};

type FuncParams = { pageParam: number };

export interface ContentOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
}

export interface LikedTweetContent {
  _id: string;
  content: string;
  owner: ContentOwner;
  updatedAt: string;
}

export interface LikedCommentContent {
  _id: string;
  content: string;
  comment: string;
  owner: ContentOwner;
  updatedAt: string;
}

export type LikedContent = {
  _id: string;
  likedBy: string;
  updatedAt: string;
} & (
  | { tweet: LikedTweetContent; comment?: never }
  | { comment: LikedCommentContent; tweet?: never }
);

export interface LikedPaginationData {
  liked: LikedContent[];
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage?: boolean;
}

interface ApiResponse {
  statusCode: number;
  data: LikedPaginationData;
  message: string;
  success: boolean;
}
