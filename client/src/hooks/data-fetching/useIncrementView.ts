import { useMutation } from "@tanstack/react-query";

export const useIncrementView = () => {
  return useMutation({
    mutationFn: async ({ videoId, watchTime }: IncrementViewData) => {
      const response = await fetch(`${URL}/videos/view/${videoId}`, {
        method: "POST",
        body: JSON.stringify(watchTime),
      });
      if (!response.ok) throw new Error("Response Error for View Update");
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (data?.data?.counted) {
        console.log("✅ View counted successfully");
      }
    },
    onError: (error) => {
      console.error("❌ Failed to count view:", error);
    },
  });
};

interface IncrementViewData {
  videoId: string;
  watchTime: number;
}

const URL = import.meta.env.VITE_SERVER_URL;
