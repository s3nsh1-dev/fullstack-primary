import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const useDeleteVideoFromPlaylist = () => {
  return useMutation({
    mutationKey: ["playlist", "remove-video"],
    mutationFn: async ({ playlistId, videoId }: ResponseParamsType) =>
      callApi({ playlistId, videoId }),
  });
};

export default useDeleteVideoFromPlaylist;

const URL = import.meta.env.VITE_BASE_URL;

const callApi = async ({ playlistId, videoId }: ResponseParamsType) => {
  const { data } = await axios<ModifyPlaylistVideosResponse>({
    url: `${URL}/playlists/remove/${videoId}/${playlistId}`,
    method: "patch",
    withCredentials: true,
  });
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
};

interface ResponseParamsType {
  playlistId: string;
  videoId: string;
}
interface PlaylistOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
}

interface PlaylistWithOwner {
  _id: string;
  name: string;
  description: string;
  videos: string[];
  owner: PlaylistOwner;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ModifyPlaylistVideosResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    playlist: PlaylistWithOwner;
  };
}
