import { useQuery } from "@tanstack/react-query";

const useCheckLikeOnVideo = (videoId: string) => {
  return useQuery({
    queryKey: ["checkLikeOnVideo", videoId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/likes/check-video/${videoId}`,
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

export default useCheckLikeOnVideo;
export type ApiResponse = {
  statusCode: number; // e.g. 200
  data: boolean; // true if liked, false if not
  message: string; // e.g. "TWEET IS LIKED SUCCESSFULLY"
  success: boolean; // true if operation succeeded
};
