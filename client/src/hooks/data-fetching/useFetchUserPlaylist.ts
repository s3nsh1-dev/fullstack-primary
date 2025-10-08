import { useQuery } from "@tanstack/react-query";
import type { UserSubscribersAPIResponse } from "../../constants/responseTypes";

const useFetchUserSubscribers = (user_ID: string) => {
  return useQuery({
    queryKey: ["userSubscribers", user_ID],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/subscriptions/c/${user_ID}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error("ERROR WHILE FETCHING USER SUBSCRIBERS");
      const data: UserSubscribersAPIResponse = await response.json();
      const result = data.data;
      return result;
    },
    enabled: !!user_ID, // only fetch if user._id exists
  });
};

export default useFetchUserSubscribers;
