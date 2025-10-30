import { useQuery } from "@tanstack/react-query";
import type { UserLoginResponseType } from "../../constants/responseTypes";

const URL = import.meta.env.VITE_SERVER_URL;

export const useRefreshUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await fetch(`${URL}/users/refresh-token`, {
        credentials: "include",
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to refresh user");
      const data: UserLoginResponseType = await response.json();
      return data.data; // user object
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
    refetchOnWindowFocus: false,
    retry: false,
  });
};
