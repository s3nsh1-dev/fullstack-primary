import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchWatchHistory = ({ limit }: HookParams) => {
  return useInfiniteQuery({
    queryKey: ["watch-history", limit],
    queryFn: async ({ pageParam }) => {
      const { data } = await axios<WatchHistoryApiResponse>({
        url: `${URL}/users/history?page=${pageParam}&limit=${limit}`,
        method: "get",
        withCredentials: true,
      });
      return data.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.hasPreviousPage ? firstPage.currentPage - 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export default useFetchWatchHistory;

const URL = import.meta.env.VITE_SERVER_URL;

export interface VideoOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
  coverImage: string;
}

export interface WatchHistoryVideo {
  _id: string;
  title: string;
  description: string;
  videoFile: string;
  thumbnail: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  owner: VideoOwner;
}

export interface WatchHistoryPaginationData {
  data: WatchHistoryVideo[]; // The array name remains 'data'
  totalHistory: number; // Renamed from 'total'
  totalPage: number; // Renamed from 'totalPages'
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  limit: number;
}

interface WatchHistoryApiResponse {
  statusCode: number;
  data: WatchHistoryPaginationData;
  message: string;
  success: boolean;
}

type HookParams = {
  limit: number;
};
