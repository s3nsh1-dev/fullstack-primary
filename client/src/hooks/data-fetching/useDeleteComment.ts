import { useMutation } from "@tanstack/react-query";
import type { DeleteOneApiResponse } from "../../constants/responseTypes";

import { env } from "../../utilities/envHelper";

const URL = env.VITE_SERVER_URL;

const useDeleteComment = () => {
  return useMutation({
    mutationKey: ["deleteComment"],
    mutationFn: async (commentId: string) => {
      const response = await fetch(`${URL}/comments/modify/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE DELETING COMMENT");
      const result: DeleteOneApiResponse = await response.json();
      return result;
    },
  });
};

export default useDeleteComment;
