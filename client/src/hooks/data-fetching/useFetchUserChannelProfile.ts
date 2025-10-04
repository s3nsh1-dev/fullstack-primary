import { useQuery } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useFetchUserChannelProfile = (username: string) => {
  return useQuery({
    queryKey: ["userChannelProfile", username],
    queryFn: async () => {
      const response = await fetch(`${URL}/users/channel/${username}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING LIKED CONTENT");
      const data: UserChannelResponse = await response.json();
      const result = data.data.data;
      return result;
    },
  });
};
export default useFetchUserChannelProfile;

export interface UserChannel {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  coverImage: string;
  subscriberCount: number;
  channelSubscribedToCount: number;
  isSubscribed: boolean;
}

export interface UserChannelData {
  data: UserChannel;
}

export interface UserChannelResponse {
  statusCode: number;
  data: UserChannelData;
  message: string;
  success: boolean;
}
