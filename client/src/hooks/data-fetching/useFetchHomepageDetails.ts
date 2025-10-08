import { useQuery } from "@tanstack/react-query";

const useFetchHomepageDetails = (username: string) => {
  console.log("username:", username);
  return useQuery({
    queryKey: ["homepage", username],
    queryFn: async () => {
      console.log("homepage data:");
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/homepage/${username}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error("ERROR WHILE FETCHING SUBSCRIBER COUNT");
      const data: ApiResponse = await response.json();
      const result = data.data;
      return result;
    },
    enabled: !!username, // only fetch if user._id exists
  });
};
export default useFetchHomepageDetails;

interface ApiResponse {
  statusCode: number;
  data: {
    user: {
      _id: string;
      username: string;
      email: string;
      fullname: string;
      avatar: string;
      coverImage: string;
      createdAt: string; // ISO date string
    };
    isSubbed: boolean;
    totalSubscribers: number;
    totalVideos: number;
    totalTweets: number;
  };
  message: string;
  success: boolean;
}
