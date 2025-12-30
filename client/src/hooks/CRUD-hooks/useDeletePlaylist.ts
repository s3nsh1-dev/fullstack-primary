import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useDeletePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-playlist"],
    mutationFn: async ({ playlistId }: DeletePlaylistParams) =>
      callApi({ playlistId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-playlists"] });
    },
  });
};

export default useDeletePlaylist;

const callApi = async ({ playlistId }: DeletePlaylistParams) => {
  const { data } = await axios<DeletePlaylistResponse>({
    method: "delete",
    url: `${URL}/playlists/${playlistId}`,
    withCredentials: true,
  });
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
};

const URL = import.meta.env.VITE_SERVER_URL;

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
