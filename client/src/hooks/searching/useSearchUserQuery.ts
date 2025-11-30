import { useQuery } from "@tanstack/react-query";

const useSearchUserQuery = (searchText: string) => {
  console.log("searchedAgain");
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
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
};

export default useSearchUserQuery;

const URL = import.meta.env.VITE_SERVER_URL;

// src/types/search.types.ts

export interface TweetSearchResult {
  _id: string;
  content: string;
  owner: OwnerInfo;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
}

export interface VideoSearchResult {
  _id: string;
  owner: OwnerInfo;
  videoFile: string;
  videoPublicId: string;
  thumbnail: string;
  thumbPublicId: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserSearchResult {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  createdAt: string; // ISO 8601 timestamp
}

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

export interface OwnerInfo {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
}
