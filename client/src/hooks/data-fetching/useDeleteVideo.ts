import { useMutation } from "@tanstack/react-query";

// STILL A TEMPLATE

const useDeleteVideo = () => {
  return useMutation({
    mutationKey: ["deleteVideo"],
    mutationFn: async (videoId: string) => {
      const response = await fetch(`${URL}/videos/${videoId}`, {
        credentials: "include",
        method: "DELETE",
      });
      if (!response.ok) throw new Error("ERROR WHILE DELETING VIDEO");
      return true;
    },
  });
};

export default useDeleteVideo;

const URL = import.meta.env.VITE_SERVER_URL;
