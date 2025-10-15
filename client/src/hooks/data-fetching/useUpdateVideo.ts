import { useMutation } from "@tanstack/react-query";

// STILL A TEMPLATE

const useUpdateVideo = () => {
  return useMutation({
    mutationKey: ["updateVideo"],
    mutationFn: async () => {
      const response = await fetch(`${URL}/videos/VIDEO_ID`, {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // video update data here
        }),
      });
      if (!response.ok) throw new Error("ERROR WHILE UPDATING VIDEO");
      const data = await response.json();
      return data;
    },
  });
};

export default useUpdateVideo;

const URL = import.meta.env.VITE_SERVER_URL;
