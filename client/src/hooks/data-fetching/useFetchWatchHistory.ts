import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchWatchHistory = ({ page, limit }: HookParams) => {
  return useQuery({
    queryKey: ["get-watch-history", page, limit],
    queryFn: async () => {
      const { data } = await axios<WatchHistoryApiResponse>({
        url: `${URL}/users/history?page=${page}&limit=${limit}`,
        method: "get",
        withCredentials: true,
      });
      return data.data;
    },
    enabled: Boolean(page && limit),
  });
};

export default useFetchWatchHistory;

const URL = import.meta.env.VITE_SERVER_URL;

interface VideoOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
  coverImage: string;
}

interface WatchHistoryVideo {
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

interface WatchHistoryPaginationData {
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
  page: number;
  limit: number;
};
