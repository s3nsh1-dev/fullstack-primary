import { useMutation } from "@tanstack/react-query";

const useUpdateWatchHistory = () => {
  return useMutation({
    mutationKey: ["update-watch-history"],
    mutationFn: async (videoId: string) => {
      const response = await fetch(`${URL}/users/history/${videoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update watch history");
      const data: ApiResponse = await response.json();
      return data;
    },
  });
};

export default useUpdateWatchHistory;

const URL = import.meta.env.VITE_SERVER_URL;

interface ApiResponse {
  statusCode: number;
  data: string[]; // array of video IDs
  message: string;
  success: boolean;
}
