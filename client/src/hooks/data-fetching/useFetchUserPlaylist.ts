import { useQuery } from "@tanstack/react-query";

const useFetchUserPlaylist = (user_ID: string) => {
  return useQuery({
    queryKey: ["user-playlists", user_ID],
    queryFn: async () => {
      const response = await fetch(`${URL}/playlists/user/${user_ID}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING USER PLAYLISTS");
      const data: PlaylistResponse = await response.json();
      const result = data.data;
      return result;
    },
    enabled: !!user_ID, // only fetch if user._id exists
  });
};

export default useFetchUserPlaylist;

const URL = import.meta.env.VITE_SERVER_URL;

interface VideoOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
}

interface Video {
  _id: string;
  owner: VideoOwner;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  updatedAt: string; // ISO date string
}

export interface Playlist {
  _id: string;
  name: string;
  description: string;
  videos: Video[];
  owner: string; // just the owner's ID here, not a populated object
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface PlaylistData {
  playlists: Playlist[];
  length: number;
}

interface PlaylistResponse {
  statusCode: number;
  data: PlaylistData;
  message: string;
  success: boolean;
}
