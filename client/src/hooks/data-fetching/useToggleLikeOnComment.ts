import { useMutation } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useToggleLikeOnComment = () => {
  return useMutation({
    mutationKey: ["likeComment"],
    mutationFn: async (commentId: string) => {
      const response = await fetch(`${URL}/likes/toggle/c/${commentId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING COMMENT LIKES");
      const data: ApiResponse<LikeAddedResponse | LikeRemovedResponse> =
        await response.json();
      console.log(data);
      return data.data.result;
    },
  });
};

export default useToggleLikeOnComment;
export type LikeRemovedResponse = {
  result: {
    acknowledged: boolean;
    deletedCount: number;
  };
};
export type LikeAddedResponse = {
  result: {
    comment: string; // tweet ID
    likedBy: string; // user ID
    _id: string; // like record ID
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
  };
};

type ApiResponse<T> = {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
};
