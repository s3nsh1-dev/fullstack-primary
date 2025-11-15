import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchUserSubscribers = ({ userId, page, limit }: HookParams) => {
  return useQuery({
    queryKey: ["userSubscribers", userId, page, limit],
    queryFn: async () => {
      const { data } = await axios<SubscriberApiResponse>({
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/subscriptions/c/${userId}?page=${page}&limit=${limit}`,
        method: "get",
        withCredentials: true,
      });
      return data.data;
    },
    enabled: Boolean(userId && page),
  });
};

export default useFetchUserSubscribers;

type HookParams = {
  userId: string;
  page: number;
  limit: number;
};

interface SubscriberUser {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
}

interface ChannelSubscriber {
  _id: string; // The ID of the subscription document itself
  subscriber: SubscriberUser;
  channel: string; // The ID of the channel being subscribed to
  createdAt: string;
}

interface SubscriberPaginationData {
  subscribers: ChannelSubscriber[];
  totalSubscribers: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentPage: number;
  limit: number;
}

interface SubscriberApiResponse {
  statusCode: number;
  data: SubscriberPaginationData;
  message: string;
  success: boolean;
}
