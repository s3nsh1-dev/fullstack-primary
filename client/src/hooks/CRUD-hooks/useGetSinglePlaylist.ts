import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetSinglePlaylist = (playlistId: string) => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async () => callApi(playlistId),
  });
};

export default useGetSinglePlaylist;

const callApi = async (playlistId: string) => {
  const { data } = await axios<FetchPlaylistResponse>({
    method: "get",
    url: `${URL}/playlists/${playlistId}`,
  });
  if (data.success) {
    return data.data.playlist;
  }
  return data.data.playlist;
};

export interface PlaylistOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string; // URL
}
export interface PlaylistWithOwner {
  _id: string;
  name: string;
  description: string;
  videos: string[]; // Video IDs (currently empty)
  owner: PlaylistOwner; // Populated user object
}
export interface FetchPlaylistResponseData {
  playlist: PlaylistWithOwner;
}
export interface FetchPlaylistResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: FetchPlaylistResponseData;
}

const URL = import.meta.env.VITE_BASE_URL;
