import { useMutation } from "@tanstack/react-query";

const useAddCommentOnVideo = () => {
  return useMutation({
    mutationKey: ["addCommentOnVideo"],
    mutationFn: async ({
      content,
      videoId,
    }: {
      content: string;
      videoId: string;
    }) => {
      const response = await fetch(`${URL}/comments/v/${videoId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING COMMENTS");
      const data: CreateCommentResponse = await response.json();
      const result = data;
      return result;
    },
  });
};

export default useAddCommentOnVideo;

const URL = import.meta.env.VITE_SERVER_URL;

type CreateCommentResponse = {
  statusCode: number;
  data: {
    comment: {
      _id: string;
      content: string;
      video: string;
      owner: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  };
  message: string;
  success: boolean;
};
