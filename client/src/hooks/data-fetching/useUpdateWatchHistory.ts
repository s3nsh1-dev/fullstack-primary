import { useMutation } from "@tanstack/react-query";
import { env } from "../../utilities/envHelper";

const useUpdateWatchHistory = () => {
  return useMutation({
    mutationKey: ["update-watch-history"],
    mutationFn: async ({
      videoId,
      userId,
    }: {
      videoId: string;
      userId: string;
    }) => {
      const response = await fetch(
        `${URL}/users/history/${videoId}?userId=${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to update watch history");
      const data: ApiResponse = await response.json();
      return data;
    },
  });
};

export default useUpdateWatchHistory;

const URL = env.VITE_SERVER_URL;

interface ApiResponse {
  statusCode: number;
  data: boolean;
  message: string;
  success: boolean;
}
