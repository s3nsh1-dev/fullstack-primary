import { useQuery } from "@tanstack/react-query";

const useSearchUserQuery = (userText: string) => {
  return useQuery({
    queryKey: ["searchQuery", userText],
    queryFn: async () => {
      const response = await fetch(`${URL}/search/q/${userText}`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Search Query Response is Corrupted");
      const data = await response.json();
      const result = data.data;
      return result;
    },
    enabled: !!userText,
    staleTime: 10 * 60 * 1000,
  });
};

export default useSearchUserQuery;

const URL = import.meta.env.VITE_SERVER_URL;
