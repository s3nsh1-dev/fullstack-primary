import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const useCreatePlaylist = () => {
  return useMutation({
    mutationKey: ["create-playlist"],
    mutationFn: async ({ name, description }: BodyResponseType) =>
      callingApi({ name, description }),
  });
};

export default useCreatePlaylist;

const callingApi = async ({ name, description }: BodyResponseType) => {
  const { data } = await axios<CreatePlaylistResponse>({
    method: "post",
    withCredentials: true,
    url: `${URL}/playlists`,
    data: {
      name,
      description,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "ERROR WHILE CREATING PLAYLIST");
  }
  return data;
};

interface Playlist {
  _id: string;
  name: string;
  description: string;
  videos: string[]; // Empty now, but should be IDs
  owner: string; // User ID
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  __v: number; // Mongoose version key
}

interface CreatePlaylistResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: CreatePlaylistResponseData;
}

interface CreatePlaylistResponseData {
  playlist: Playlist;
}

const URL = import.meta.env.VITE_SERVER_URL;

type BodyResponseType = {
  name: string;
  description: string;
};
