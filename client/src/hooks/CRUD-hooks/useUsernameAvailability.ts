import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axios, { type AxiosResponse } from "axios";

const useUsernameAvailability = (input: string) => {
  const [debounced, setDebounced] = useState(input);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(input), 400);
    return () => clearTimeout(id);
  }, [input]);

  return useQuery({
    queryKey: ["check-username-availability", debounced],
    queryFn: ({ signal }) => fetchAvailability(debounced, signal),
    enabled: !!debounced,
    staleTime: 0, // always check fresh
  });
};

export default useUsernameAvailability;

const fetchAvailability = async (debounced: string, signal: AbortSignal) => {
  const response: ApiResponse = await axios({
    method: "get",
    url: `${URL}/users/check-username?inp=${encodeURIComponent(debounced)}`,
    withCredentials: true,
    signal,
  });
  if (!response) throw new Error("CHECKING USERNAME FAILED");
  console.log("axios response", response);
  return response.data.data.available;
};

const URL = import.meta.env.VITE_SERVER_URL;

type UsernameAvailabilityResponse = {
  statusCode: number;
  data: {
    available: boolean;
  };
  message: string;
  success: boolean;
};

type ApiResponse = AxiosResponse<UsernameAvailabilityResponse>;
