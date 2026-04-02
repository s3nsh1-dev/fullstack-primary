import { useMutation } from "@tanstack/react-query";
import { env } from "../../utilities/envHelper";

const useUpdateAvatar = () => {
  return useMutation({
    mutationKey: ["updateAvatar"],
    mutationFn: async (newFile: FormData) => {
      const response = await fetch(`${URL}/users/avatar`, {
        method: "PATCH",
        credentials: "include",
        body: newFile,
      });
      if (!response.ok) throw new Error("ERROR WHILE UPDATING AVATAR");
      const data = await response.json();
      return data;
    },
  });
};

export default useUpdateAvatar;

const URL = env.VITE_SERVER_URL;
