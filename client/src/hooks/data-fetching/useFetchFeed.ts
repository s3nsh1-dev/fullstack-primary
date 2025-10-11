import { useQuery } from "@tanstack/react-query";

const useFetchFeed = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const response = await fetch(`${URL}/feeds`, {
        // credentials: "include",
        method: "GET",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING FEED");
      const data = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

export default useFetchFeed;

const URL = import.meta.env.VITE_SERVER_URL;
