import { useQuery } from "@tanstack/react-query";
import type { UserLoginResponseType } from "../../constants/responseTypes";
import { env } from "../../utilities/envHelper";

const useFetchSelfSubbedChannels = (userId: string) => {
  return useQuery({
    queryKey: ["subscriberCount", userId],
    queryFn: async () => {
      const response = await fetch(
        `${env.VITE_SERVER_URL}/subscriptions/u/${userId}`
      );
      if (!response.ok)
        throw new Error("ERROR WHILE FETCHING SUBSCRIBER COUNT");
      const result: UserLoginResponseType = await response.json();
      return result.data;
    },
  });
};

export default useFetchSelfSubbedChannels;
