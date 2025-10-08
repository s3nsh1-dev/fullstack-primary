import { useMutation } from "@tanstack/react-query";

const useCreateTweet = () => {
  return useMutation({
    mutationKey: ["createTweet"],
    mutationFn: async (content: string) => {
      const response = await fetch(`${URL}/tweets`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("ERROR WHILE CREATING TWEET");
      const data = await response.json();
      return data.data;
    },
  });
};

export default useCreateTweet;

const URL = import.meta.env.VITE_SERVER_URL;
