import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useDeletePlaylist = () => {
  return useMutation({
    mutationKey: ["delete-playlist"],
    mutationFn: async ({ playlistId }: DeletePlaylistParams) =>
      callApi({ playlistId }),
  });
};

export default useDeletePlaylist;

const callApi = async ({ playlistId }: DeletePlaylistParams) => {
  const { data } = await axios<DeletePlaylistResponse>({
    method: "delete",
    url: `${URL}/playlist/${playlistId}`,
    withCredentials: true,
  });
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
};

const URL = import.meta.env.VITE_BASE_URL;

interface DeletePlaylistResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    result: {
      acknowledged: boolean;
      deletedCount: number; // 1 if deleted successfully
    };
  };
}

interface DeletePlaylistParams {
  playlistId: string;
}
