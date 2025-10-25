import { useQuery } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useFetchSingleVideo = ({
  videoId,
  userId,
}: {
  videoId: string;
  userId: string;
}) => {
  return useQuery({
    queryKey: ["singleVideo", videoId, userId],
    queryFn: async () => {
      const link = `${URL}/videos/${videoId}?userId=${userId}`;
      const response = await fetch(link, {
        credentials: "include",
        method: "GET",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING VIDEO");
      const data: ApiResponse = await response.json();
      return data.data;
    },
  });
};

export default useFetchSingleVideo;

export interface SingleVideoType {
  _id: string;
  owner: {
    _id: string;
    username: string;
    fullname: string;
    avatar: string;
    coverImage: string;
  };
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
  video: SingleVideoType;
  isLikedByUser: boolean;
  likesCount: number;
}

interface ApiResponse {
  statusCode: number;
  data: Data;
  message: string;
  success: boolean;
}
