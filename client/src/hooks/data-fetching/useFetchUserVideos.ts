import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchUserVideos = ({
  userId,
  page,
  limit,
  query = "",
  sortBy = "",
  sortType = "",
}: HookParams) => {
  return useQuery({
    queryKey: ["fetchVideos", userId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        userId,
        page: String(page),
        limit: String(limit),
      });

      if (query) params.append("query", query);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortType) params.append("sortType", sortType);

      const { data } = await axios<ApiResponse>({
        url: `${URL}/videos?${params.toString()}`,
        method: "get",
      });
      return data.data;
    },
    enabled: Boolean(userId && page > 0 && limit > 0),
  });
};
export default useFetchUserVideos;

const URL = import.meta.env.VITE_SERVER_URL;

interface VideoDetail {
  _id: string;
  owner: string; // The ID of the user/channel owner
  videoFile: string; // URL
  thumbnail: string; // URL
  title: string;
  description: string;
  duration: number; // In seconds
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VideoPaginationData {
  videos: VideoDetail[];
  totalVideos: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  limit: number;
}

interface ApiResponse {
  statusCode: number;
  data: VideoPaginationData;
  message: string;
  success: boolean;
}
type HookParams = {
  userId: string;
  page: number;
  limit: number;
  query?: string;
  sortBy?: string;
  sortType?: string;
};
