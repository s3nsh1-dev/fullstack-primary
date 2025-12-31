import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteVideoFromPlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["playlist", "remove-video"],
    mutationFn: async ({ playlistId, videoId }: ResponseParamsType) =>
      callApi({ playlistId, videoId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["playlist", variables.playlistId],
      });
      queryClient.invalidateQueries({ queryKey: ["user-playlists"] });
    },
  });
};

export default useDeleteVideoFromPlaylist;

const URL = import.meta.env.VITE_SERVER_URL;

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
