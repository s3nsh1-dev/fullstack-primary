import { useQuery } from "@tanstack/react-query";

const useFetchFeed = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const response = await fetch(`${URL}/feeds`, {
        // credentials: "include",
        method: "GET",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING FEED");
      const data: FeedResponse = await response.json();
      return data.data.feed;
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

export default useFetchFeed;

const URL = import.meta.env.VITE_SERVER_URL;

// Type for the user/owner object
export type Owner = {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
};

// Type for a video feed item
export type VideoItem = {
  _id: string;
  owner: Owner;
  videoFile: string;
  videoPublicId: string;
  thumbnail: string;
  thumbPublicId: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// Type for a tweet feed item
export type TweetItem = {
  _id: string;
  content: string;
  owner: Owner;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// Type for any feed item (video or tweet)
type FeedItem = VideoItem | TweetItem;

// Type for the feed data
type FeedData = {
  feed: FeedItem[];
  length: number;
};

// Type for the full API response
type FeedResponse = {
  statusCode: number;
  data: FeedData;
  message: string;
  success: boolean;
};
