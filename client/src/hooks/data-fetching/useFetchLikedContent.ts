import { useQuery } from "@tanstack/react-query";

const useFetchLikedContent = (user_ID: string) => {
  return useQuery({
    queryKey: ["likedContent", user_ID],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/likes/content/${user_ID}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("ERROR WHILE FETCHING LIKED CONTENT");
      const data: LikedContentResponse = await response.json();
      const result = data.data.liked;
      return result;
    },
    enabled: !!user_ID, // only fetch if user._id exists
    staleTime: 10 * 60 * 1000, // 10min
  });
};

export default useFetchLikedContent;

// User type (owner of content)
interface User {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
}

// Tweet type
export interface Tweet {
  _id: string;
  content: string;
  owner: User;
  updatedAt: string;
}

// Comment type
export interface Comment {
  _id: string;
  content: string;
  tweet?: string; // Reference to tweet (if comment is on a tweet)
  comment?: string; // Reference to parent comment (if this is a reply)
  owner: User;
  updatedAt: string;
}

// Video type
export interface Video {
  _id: string;
  owner: User;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  updatedAt: string;
}

// Like item type (each item in the liked array)
export interface LikedItem {
  _id: string;
  tweet?: Tweet; // Present if user liked a tweet
  comment?: Comment; // Present if user liked a comment
  video?: Video; // Present if user liked a video
  likedBy: string;
  updatedAt: string;
}

// Main response type
interface LikedContentResponse {
  statusCode: number;
  data: {
    liked: LikedItem[];
    total: number;
  };
  message: string;
  success: boolean;
}
