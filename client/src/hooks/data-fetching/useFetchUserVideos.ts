import { useQuery } from "@tanstack/react-query";
import type { UserVideosAPIResponse } from "../../constants/responseTypes";

const URL = import.meta.env.VITE_SERVER_URL;

const useFetchUserVideos = (user_ID: string) => {
  return useQuery({
    queryKey: ["fetchVideos", user_ID],
    queryFn: async () => {
      const response = await fetch(`${URL}/videos?userId=${user_ID}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING LIKED CONTENT");
      const data: UserVideosAPIResponse = await response.json();
      const result = data.data;
      return result;
    },
    enabled: !!user_ID, // only fetch if user._id exists
  });
};
export default useFetchUserVideos;
