import { useQuery } from "@tanstack/react-query";

const useFetchUserPlaylist = ({ userId, limit, page }: ParamsType) => {
  return useQuery({
    queryKey: ["user-playlists", userId, limit, page],
    queryFn: async () => {
      const response = await fetch(
        `${URL}/playlists/user/${userId}?limit=${limit}&page=${page}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("ERROR WHILE FETCHING USER PLAYLISTS");
      const data: PlaylistResponse = await response.json();
      return data.data;
    },
    enabled: !!userId,
    staleTime: 60 * 60 * 1000,
  });
};

export default useFetchUserPlaylist;

const URL = import.meta.env.VITE_SERVER_URL;

interface VideoOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
}

interface Video {
  _id: string;
  owner: VideoOwner;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  updatedAt: string;
}

export interface Playlist {
  _id: string;
  name: string;
  description: string;
  videos: Video[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistData {
  playlists: Playlist[];
  length: number;
  totalPages: number;
  hasNextPage: boolean;
  havePrevPage: boolean;
  currentPage: number;
  limit: number;
}

interface PlaylistResponse {
  statusCode: number;
  data: PlaylistData;
  message: string;
  success: boolean;
}

type ParamsType = {
  userId: string;
  limit: number;
  page: number;
};
