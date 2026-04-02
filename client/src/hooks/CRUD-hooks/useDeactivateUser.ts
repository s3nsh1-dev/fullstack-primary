import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { env } from "../../utilities/envHelper";

const useDeactivateUser = () => {
  return useMutation({
    mutationKey: ["deactivate-user"],
    mutationFn: async () => {
      const { data } = await axios<ApiResponse>({
        url: `${URL}/users/deactivate-user`,
        method: "patch",
        withCredentials: true,
      });
      if (!data) throw new Error("ERROR IN REQUEST TO DEACTIVATE USER");
      const result = data.data;
      return result;
    },
  });
};

export default useDeactivateUser;

const URL = env.VITE_SERVER_URL;

interface ApiResponse {
  statusCode: number;
  data: { deactivated: boolean };
  message: string;
  success: boolean;
}
