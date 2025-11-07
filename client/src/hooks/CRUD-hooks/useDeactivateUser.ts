import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useDeactivateUser = () => {
  return useMutation({
    mutationKey: ["deactivate-user"],
    mutationFn: async () => {
      const { data } = await axios({
        url: `${URL}/users/deactivate-user`,
        method: "post",
        withCredentials: true,
      });
      if (!data) throw new Error("ERROR IN REQUEST TO DEACTIVATE USER");
      const result = data.data;
      return result;
    },
  });
};

export default useDeactivateUser;

const URL = import.meta.env.VITE_SERVER_URL;
