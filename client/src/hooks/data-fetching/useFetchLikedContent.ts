import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchLikedContent = ({ userId, limit }: HookParams) => {
  return useInfiniteQuery({
    queryKey: ["likedContent", userId],
    queryFn: async ({ pageParam }: FuncParams) => {
      const { data } = await axios<ApiResponse>({
        url: `${URL}/likes/content/${userId}?page=${pageParam}&limit=${limit}`,
        method: "get",
        withCredentials: true,
      });
      return data.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.hasPreviousPage ? firstPage.currentPage - 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export default useFetchLikedContent;

const URL = import.meta.env.VITE_SERVER_URL;

type HookParams = {
  userId: string;
  limit: number;
};

type FuncParams = { pageParam: number };

export interface IOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string; // URL
}

export interface IBaseContent {
  _id: string;
  owner: IOwner;
  updatedAt: string; // ISO Date string
}

export interface ITweet extends IBaseContent {
  content: string;
}

export interface IComment extends IBaseContent {
  content: string;
  tweet?: string; // ID of the parent Tweet
  video?: string; // ID of the parent Video
}

export interface IVideo extends IBaseContent {
  videoFile: string; // URL
  thumbnail: string; // URL
  title: string;
  description: string;
}

export interface ILikedContent {
  _id: string;
  likedBy: string; // User ID of the person who liked the content
  updatedAt: string; // ISO Date string of when the like happened

  tweet?: ITweet;
  comment?: IComment;
  video?: IVideo;
}

export interface IPaginatedResponseData {
  liked: ILikedContent[];
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiResponse {
  statusCode: number;
  data: IPaginatedResponseData;
  message: string;
  success: boolean;
}
