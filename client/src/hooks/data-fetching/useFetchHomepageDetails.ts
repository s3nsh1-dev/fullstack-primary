import { useQuery } from "@tanstack/react-query";
import type { HomePageFormatType } from "../../constants/dataTypes";

const useFetchHomepageDetails = (user_ID: string) => {
  return useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/homepage/${user_ID}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error("ERROR WHILE FETCHING SUBSCRIBER COUNT");
      const data = await response.json();
      const result: HomePageFormatType = data.data.user[0];
      return result;
    },
    enabled: !!user_ID, // only fetch if user._id exists
    staleTime: 10 * 60 * 1000, // 10min
  });
};
export default useFetchHomepageDetails;
