import { useQuery } from "@tanstack/react-query";

const useFetchHomepageDetails = ({
  username,
  userId,
}: {
  username: string;
  userId: string;
}) => {
  return useQuery({
    queryKey: ["homepage", username, userId],
    queryFn: async () => {
      console.log("homepage API");
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/homepage/${username}?userId=${userId}`,
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
