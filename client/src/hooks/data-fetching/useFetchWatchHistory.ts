import { useQuery } from "@tanstack/react-query";

const useFetchWatchHistory = () => {
  return useQuery({
    queryKey: ["get-watch-history"],
    queryFn: async () => {
      const response = await fetch(`${URL}/users/history`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch watch history");
      const data: WatchHistoryResponse = await response.json();
      return data.data;
    },
  });
};

export default useFetchWatchHistory;

const URL = import.meta.env.VITE_SERVER_URL;

interface WatchHistoryResponse {
  statusCode: number;
  data: {
    _id: string;
    watchHistory: WatchHistoryItem[];
  };
  message: string;
  success: boolean;
}

interface WatchHistoryItem {
  _id: string;
  owner: {
    _id: string;
    username: string;
    fullname: string;
    avatar: string;
  };
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
