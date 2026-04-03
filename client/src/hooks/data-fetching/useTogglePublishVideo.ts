import { useMutation } from "@tanstack/react-query";
import { env } from "../../utilities/envHelper";

const useTogglePublishVideo = () => {
  return useMutation({
    mutationKey: ["togglePublishVideo"],
    mutationFn: async (videoId: string) => {
      const response = await fetch(`${URL}/videos/toggle/publish/${videoId}`, {
        credentials: "include",
        method: "PATCH",
      });
      if (!response.ok) throw new Error("ERROR WHILE TOGGLING PUBLISH STATUS");
      const data: TogglePublishResponse = await response.json();
      return data;
    },
  });
};

export default useTogglePublishVideo;

const URL = env.VITE_SERVER_URL;

interface TogglePublishResponse {
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
