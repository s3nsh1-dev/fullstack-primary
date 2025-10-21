import { useQuery } from "@tanstack/react-query";

const useSearchUserQuery = (searchText: string) => {
  return useQuery({
    queryKey: ["searchQuery", searchText],
    queryFn: async () => {
      const response = await fetch(`${URL}/search/q/${searchText}`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Search Query Response is Corrupted");
      const data: SearchResponse = await response.json();
      return data;
    },
    enabled: !!searchText,
    staleTime: 10 * 60 * 1000,
  });
};

export default useSearchUserQuery;

const URL = import.meta.env.VITE_SERVER_URL;

// src/types/search.types.ts

interface SearchResponse {
  statusCode: number;
  data: SearchData | NoContent;
  message: string;
  success: boolean;
}

interface NoContent {
  result: string;
}

interface SearchData {
  user: UserSearchResult[];
  video: VideoSearchResult[];
  tweet: TweetSearchResult[];
}

interface UserSearchResult {
  _id?: string;
  username: string;
  fullname: string;
  avatar?: string;
}

interface VideoSearchResult {
  _id?: string;
  title: string;
  thumbnail?: string;
  owner?: string;
}

interface TweetSearchResult {
  _id?: string;
  content: string;
  author?: string;
  createdAt: string;
}
