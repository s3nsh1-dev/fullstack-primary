import { useMutation } from "@tanstack/react-query";

const useToggleSubscription = () => {
  return useMutation({
    mutationKey: ["toggleSubscription"],
    mutationFn: async (channelId: string) => {
      const response = await fetch(`${URL}/subscriptions/c/${channelId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING VIDEO LIKES");
      const data: ApiResponse = await response.json();
      return data.data.result;
    },
  });
};

export default useToggleSubscription;
export type UnSubbedResponse = {
  result: {
    acknowledged: boolean;
    deletedCount: number;
  };
};
export type SubbedResponse = {
  result: {
    _id: string;
    subscriber: string;
    channel: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
};

type ApiResponse = {
  statusCode: number;
  data: UnSubbedResponse | SubbedResponse;
  message: string;
  success: boolean;
};
const URL = import.meta.env.VITE_SERVER_URL;
