import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useReactivateUser = () => {
  return useMutation({
    mutationKey: ["reactivate-user"],
    mutationFn: async () => {
      const { data } = await axios<ApiResponse>({
        url: `${URL}/users/reactivate-user`,
        method: "patch",
        withCredentials: true,
      });
      if (!data) throw new Error("ERROR IN REQUEST TO REACTIVATE USER");
      const result = data.data;
      return result;
    },
  });
};

export default useReactivateUser;

const URL = import.meta.env.VITE_SERVER_URL;

interface ApiResponse {
  statusCode: number;
  data: { deactivated: boolean };
  message: string;
  success: boolean;
}
