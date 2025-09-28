import { useQuery } from "@tanstack/react-query";
const useCheckLikeOnTweet = (tweetId: string) => {
  return useQuery({
    queryKey: ["checkLikeOnTweet", tweetId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/likes/check-tweet/${tweetId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("ERROR WHILE FETCHING LIKED CONTENT");
      const data: ApiResponse = await response.json();
      const result = data;
      return result;
    },
  });
};

export default useCheckLikeOnTweet;

export type ApiResponse = {
  statusCode: number; // e.g. 200
  data: boolean; // true if liked, false if not
  message: string; // e.g. "TWEET IS LIKED SUCCESSFULLY"
  success: boolean; // true if operation succeeded
};
