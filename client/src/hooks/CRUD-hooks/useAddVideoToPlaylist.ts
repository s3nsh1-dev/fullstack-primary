import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useAddVideoToPlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add-video-to-playlist"],
    mutationFn: async ({ playlistId, videoId }: ResponseParamsType) =>
      callApi({ playlistId, videoId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-playlists"] });
      queryClient.invalidateQueries({
        queryKey: ["playlist", variables.playlistId],
      });
    },
  });
};

export default useAddVideoToPlaylist;

const URL = import.meta.env.VITE_SERVER_URL;

const callApi = async ({ playlistId, videoId }: ResponseParamsType) => {
  const { data } = await axios<ModifyPlaylistVideosResponse>({
    url: `${URL}/playlists/add/${videoId}/${playlistId}`,
    method: "patch",
    withCredentials: true,
  });
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
};

type ResponseParamsType = {
  playlistId: string;
  videoId: string;
};

interface PlaylistOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string; // URL
}
interface PlaylistWithOwner {
  _id: string;
  name: string;
  description: string;
  videos: string[]; // Video ObjectIds
  owner: PlaylistOwner; // Populated owner
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  __v: number; // Mongoose version key
}
interface ModifyPlaylistVideosResponseData {
  playlist: PlaylistWithOwner;
}
interface ModifyPlaylistVideosResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ModifyPlaylistVideosResponseData;
}
