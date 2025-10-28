import { useQuery } from "@tanstack/react-query";

const useUsernameAvailability = (input: string) => {
  return useQuery({
    queryKey: ["check-username-availability", input],
    queryFn: async () => {
      const response = await fetch(`${URL}/users/check-username?inp=${input}`, {
        credentials: "include",
        method: "GET",
      });
      if (!response) throw new Error("CHECKING USERNAME FAILED");
      const data: UsernameAvailabilityResponse = await response.json();
      return data.data.available;
    },
    enabled: !!input,
  });
};

export default useUsernameAvailability;

const URL = import.meta.env.VITE_SERVER_URL;

type UsernameAvailabilityResponse = {
  statusCode: number;
  data: {
    available: boolean;
  };
  message: string;
  success: boolean;
};
