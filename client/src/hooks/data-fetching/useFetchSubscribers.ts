import { useQuery } from "@tanstack/react-query";
import type { UserLoginResponseType } from "../../constants/responseTypes";

const useFetchSubscribers = (userId: string) => {
  return useQuery({
    queryKey: ["subscriberCount", userId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/subscriptions/c/${userId}`
      );
      if (!response.ok)
        throw new Error("ERROR WHILE FETCHING SUBSCRIBER COUNT");
      const result: UserLoginResponseType = await response.json();
      return result.data;
    },
  });
};

export default useFetchSubscribers;
