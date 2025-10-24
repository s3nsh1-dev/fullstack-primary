import { useMutation } from "@tanstack/react-query";

export const useIncrementView = () => {
  return useMutation({
    mutationFn: async ({ videoId, watchTime }: IncrementViewData) => {
      const response = await fetch(`${URL}/views/${videoId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ watchTime }), // ✅ Send as object with watchTime property
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || "Response Error for View Update");
      }

      const data = await response.json();
      return data;
    },
  });
};

interface IncrementViewData {
  videoId: string;
  watchTime: number;
}

const URL = import.meta.env.VITE_SERVER_URL;
