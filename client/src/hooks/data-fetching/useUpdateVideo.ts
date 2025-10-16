import { useMutation } from "@tanstack/react-query";

const useUpdateVideo = () => {
  return useMutation({
    mutationKey: ["updateVideo"],
    mutationFn: async ({
      videoId,
      updateContent,
    }: {
      videoId: string;
      updateContent: FormData;
    }) => {
      const response = await fetch(`${URL}/videos/${videoId}`, {
        credentials: "include",
        method: "PATCH",
        body: updateContent,
      });
      if (!response.ok) throw new Error("ERROR WHILE UPDATING VIDEO");
      const data: UpdateVideoResponse = await response.json();
      return data.data.video;
    },
  });
};

export default useUpdateVideo;

const URL = import.meta.env.VITE_SERVER_URL;

interface UpdateVideoResponse {
  statusCode: number;
  data: {
    video: {
      _id: string;
      owner: string;
      videoFile: string;
      videoPublicId: string;
      thumbnail: string;
      thumbPublicId: string;
      title: string;
      description: string;
      duration: number;
      views: number;
      isPublished: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  };
  message: string;
  success: boolean;
}
