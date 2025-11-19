import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchLikedContent = ({ userId, limit }: HookParams) => {
  return useInfiniteQuery({
    queryKey: ["likedContent", userId],
    queryFn: async ({ pageParam = 1 }: FuncParams) => {
      const { data } = await axios({
        url: `${URL}/likes/content/${userId}?page=${pageParam}&limit=${limit}`,
        method: "get",
        withCredentials: true,
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasNextPage) {
        return lastPage.data.page + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (_, allPages) => {
      return undefined;
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
