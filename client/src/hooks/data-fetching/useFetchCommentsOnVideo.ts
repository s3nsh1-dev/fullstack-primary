import { useQuery } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;
const useFetchCommentsOnVideo = (videoId: string) => {
  return useQuery({
    queryKey: ["videoComments", videoId],
    queryFn: async () => {
      const response = await fetch(`${URL}/comments/v/${videoId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING COMMENTS");
      const data = await response.json();
      return data.data;
    },
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000,
  });
};

export default useFetchCommentsOnVideo;
