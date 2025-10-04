import { useQuery } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useFetchSingleVideo = (videoId: string) => {
  return useQuery({
    queryKey: ["singleVideo", videoId],
    queryFn: async () => {
      const response = await fetch(`${URL}/videos/${videoId}`, {
        credentials: "include",
        method: "GET",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING VIDEO");
      const data: ApiResponse = await response.json();
      return data.data.video;
    },
  });
};

export default useFetchSingleVideo;

export interface Video {
  _id: string;
  owner: string;
  videoFile: string;
  videoPublicId: string;
  thumbnail: string;
  thumbPublicId: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  __v: number;
}

export interface Data {
  video: Video;
}

interface ApiResponse {
  statusCode: number;
  data: Data;
  message: string;
  success: boolean;
}
