import { useQuery } from "@tanstack/react-query";
import type {
  SubscriberType,
  VideoType,
  PlaylistType,
} from "../../constants/dataTypes";
import type { TweetType } from "./useFetchUserTweets";

const useFetchHomepageDetails = (user_ID: string) => {
  return useQuery({
    queryKey: ["homepage", user_ID],
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
      const data: ApiResponse = await response.json();
      const result = data.data;
      return result;
    },
    enabled: !!user_ID, // only fetch if user._id exists
  });
};
export default useFetchHomepageDetails;

export type HomePageFormatType = {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  coverImage: string;
  createdAt: string; // ISO date string
  subscribers: SubscriberType[];
  videos: VideoType[];
  tweets: TweetType[];
  playlists: PlaylistType[];
  isSubbed: boolean;
};

type ApiResponse = {
  data: {
    user: HomePageFormatType;
    isSubbed: boolean;
  };
  message: string;
  success: boolean;
  statusCode: number;
};
