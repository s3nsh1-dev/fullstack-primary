import { useMutation } from "@tanstack/react-query";
import type { DeleteOneApiResponse } from "../../constants/responseTypes";

const URL = import.meta.env.VITE_SERVER_URL;

const useDeleteTweet = () => {
  return useMutation({
    mutationKey: ["deleteTweet"],
    mutationFn: async (tweetId: string) => {
      const response = await fetch(`${URL}/tweets/${tweetId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE DELETING TWEET");
      const result: DeleteOneApiResponse = await response.json();
      return result;
    },
  });
};

export default useDeleteTweet;
