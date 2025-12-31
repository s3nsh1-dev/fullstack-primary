import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetSinglePlaylist = (playlistId: string) => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async () => await callApi(playlistId),
    enabled: !!playlistId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export default useGetSinglePlaylist;

const callApi = async (playlistId: string) => {
  const { data } = await axios<FetchPlaylistWithVideosResponse>({
    method: "get",
    url: `${URL}/playlists/${playlistId}`,
  });
  if (!data.success) {
    throw new Error(data.message);
  }
  return data.data.playlist;
};

export interface PlaylistVideo {
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
  updatedAt: string;
}
interface PlaylistOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
}
export interface PlaylistWithVideos {
  _id: string;
  name: string;
  description: string;
  videos: PlaylistVideo[];
  owner: PlaylistOwner;
}
interface FetchPlaylistWithVideosResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    playlist: PlaylistWithVideos;
  };
}

const URL = import.meta.env.VITE_SERVER_URL;
