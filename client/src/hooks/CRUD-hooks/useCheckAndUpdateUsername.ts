import { useMutation } from "@tanstack/react-query";

const useCheckAndUpdateUsername = () => {
  return useMutation({
    mutationKey: ["changeUsername"],
    mutationFn: async (username: string) => {
      const response = await fetch(`${URL}/users/update/username`, {
        credentials: "include",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      if (!response) throw new Error("ERROR WHILE SENDING USERNAME REQUEST");
      const data = response.json();
      return data;
    },
  });
};

export default useCheckAndUpdateUsername;

const URL = import.meta.env.VITE_SERVER_URL;
