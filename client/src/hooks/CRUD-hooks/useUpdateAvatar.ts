import { useMutation } from "@tanstack/react-query";

const useUpdateAvatar = () => {
  return useMutation({
    mutationKey: ["updateAvatar"],
    mutationFn: async (newFile: FormData) => {
      const response = await fetch(`${URL}/users/avatar`, {
        method: "POST",
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

const URL = import.meta.env.VITE_SERVER_URL;
