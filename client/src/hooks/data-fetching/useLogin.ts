import { useMutation } from "@tanstack/react-query";
import type { UserLoginResponseType } from "../../constants/responseTypes";

const URL = import.meta.env.VITE_SERVER_URL;

const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: UserLoginType) => {
      const response = await fetch(`${URL}/users/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok)
        throw new Error("ERROR WHILE FETCHING USER LOGIN DETAILS");
      const data: UserLoginResponseType = await response.json();
      const user = data.data;
      return user;
    },
  });
};
export default useLogin;

type UserLoginType = {
  username: string;
  password: string;
  email?: string;
};
