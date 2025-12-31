import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-playlist"],
    mutationFn: async ({ name, description, playlistId }: BodyResponseType) =>
      callApi({ name, description, playlistId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-playlists"] });
      queryClient.invalidateQueries({
        queryKey: ["playlist", variables.playlistId],
      });
    },
  });
};

export default useUpdatePlaylist;

const callApi = async ({ name, description, playlistId }: BodyResponseType) => {
  const { data } = await axios<UpdatePlaylistResponse>({
    url: `${URL}/playlists/${playlistId}`,
    method: "patch",
    withCredentials: true,
    data: {
      name,
      description,
    },
  });
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
};

const URL = import.meta.env.VITE_SERVER_URL;
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
  videos: string[];
  owner: PlaylistOwner;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UpdatePlaylistResponseData {
  playlist: PlaylistWithOwner;
}

interface UpdatePlaylistResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: UpdatePlaylistResponseData;
}

type BodyResponseType = {
  name: string;
  description: string;
  playlistId: string;
};
