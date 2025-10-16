import { useMutation } from "@tanstack/react-query";

const useDeleteVideo = () => {
  return useMutation({
    mutationKey: ["deleteVideo"],
    mutationFn: async (videoId: string) => {
      const response = await fetch(`${URL}/videos/${videoId}`, {
        credentials: "include",
        method: "DELETE",
      });
      if (!response.ok) throw new Error("ERROR WHILE DELETING VIDEO");
      const data: DeleteVideoResponse = await response.json();
      return data.data.result;
    },
  });
};

export default useDeleteVideo;

const URL = import.meta.env.VITE_SERVER_URL;

interface DeleteVideoResponse {
  statusCode: number;
  data: {
    result: {
      acknowledged: boolean;
      deletedCount: number;
    };
  };
  message: string;
  success: boolean;
}
