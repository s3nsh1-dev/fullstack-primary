import { useMutation } from "@tanstack/react-query";
import type {
  UserLoginAuthDataType,
  UserLoginResponseType,
} from "../../constants/dataTypes";

type UseLoginType = {
  username: string;
  password: string;
  email?: string;
};

const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: UseLoginType) => {
      const response = await fetch("http://localhost:8000/api/v1/users/login", {
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
      const user: UserLoginAuthDataType = data.data;
      return user;
    },
  });
};
export default useLogin;
