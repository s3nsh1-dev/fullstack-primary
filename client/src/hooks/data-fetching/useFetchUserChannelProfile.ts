import { useQuery } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useFetchUserChannelProfile = ({
  username,
  adminId,
}: {
  username: string;
  adminId: string;
}) => {
  return useQuery({
    queryKey: ["userChannelProfile", username, adminId],
    queryFn: async () => {
      const response = await fetch(
        `${URL}/users/channel/${username}?adminId=${adminId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error("ERROR WHILE FETCHING USER CHANNEL PROFILE");
      const data: UserChannelResponse = await response.json();
      // if (!data) throw new Error("ERROR WHILE FETCHING USER CHANNEL PROFILE");
      const result = data?.data?.data ?? null;
      return result;
    },
    enabled: !!username,
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
  mySubCount: number;
  meSubbingCount: number;
  isSubbed: boolean;
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
