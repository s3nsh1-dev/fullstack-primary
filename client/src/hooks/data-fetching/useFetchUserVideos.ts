import { useQuery } from "@tanstack/react-query";

const useFetchUserVideos = (user_ID: string) => {
  return useQuery({
    queryKey: ["fetchVideos", user_ID],
    queryFn: async () => {
      const response = await fetch(`${URL}/videos?userId=${user_ID}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING LIKED CONTENT");
      const data: ApiResponse = await response.json();
      const result = data.data;
      return result;
    },
    enabled: !!user_ID, // only fetch if user._id exists
  });
};
export default useFetchUserVideos;

const URL = import.meta.env.VITE_SERVER_URL;

type ApiResponse = {
  statusCode: number;
  data: {
    videos: {
      _id: string;
      videoFile: string;
      thumbnail: string;
      title: string;
      description: string;
      duration: number;
      createdAt: string; // ISO date string
      isPublished: boolean;
      views: number;
      owner: string;
    }[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
    };
  };
  message: string;
  success: boolean;
};
