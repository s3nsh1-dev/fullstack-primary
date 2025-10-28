import { useMutation } from "@tanstack/react-query";

const useUpdateUsername = () => {
  return useMutation({
    mutationKey: ["update-username"],
    mutationFn: async (username: string) => {
      const response = await fetch(`${URL}/users/update/username`, {
        credentials: "include",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      if (!response) throw new Error("UPDATING USERNAME RAN INTO ERROR");
      const data = await response.json();
      return data;
    },
  });
};

export default useUpdateUsername;

const URL = import.meta.env.VITE_SERVER_URL;
