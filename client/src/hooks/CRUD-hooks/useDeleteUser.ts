import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { env } from "../../utilities/envHelper";

const useDeleteUser = () => {
  return useMutation({
    mutationKey: ["delete-user"],
    mutationFn: async () => {
      const { data } = await axios.post(
        `${URL}/users/delete-user`,
        {},
        { withCredentials: true }
      );
      if (!data) throw new Error("ERROR IN REQUEST TO DELETE USER");
      const result = data.data;
      return result;
    },
  });
};

export default useDeleteUser;

const URL = env.VITE_SERVER_URL;
