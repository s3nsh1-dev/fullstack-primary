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
      if (!response.ok) {
        let errorMessage = "Something went wrong. Please try again.";

        try {
          const errorData = await response.json();
          if (errorData.message) {
            throw new Error(errorData.message);
          }
        } catch (error) {
          console.error(error);
        }

        switch (response.status) {
          case 404:
            errorMessage = "USER DOES NOT EXIST";
            break;
          case 401:
            errorMessage = "USER PASSWORD IS INCORRECT";
            break;
          case 403:
            errorMessage = "USER ACCOUNT IS SUSPENDED";
            break;
          case 400:
            errorMessage = "INVALID CREDENTIALS";
            break;
          case 500:
            errorMessage = "SERVER ERROR. PLEASE TRY AGAIN LATER.";
            break;
          default:
            errorMessage = `Login Failed (${response.status})`;
        }
        throw new Error(errorMessage);
      }
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
