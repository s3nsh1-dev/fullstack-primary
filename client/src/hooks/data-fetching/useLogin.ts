import { useQuery } from "@tanstack/react-query";
import type {
  UserLoginResponseType,
  UserLoginType,
} from "../../constants/dataTypes";

type UseLoginType = {
  username: string;
  password: string;
  email?: string;
};

const useLogin = ({ username, password }: UseLoginType) => {
  return useQuery({
    queryKey: ["login", username],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) return "ERROR WHILE FETCHING USER LOGIN DETAILS";
      const data: UserLoginResponseType = await response.json();
      const user: UserLoginType = data.data.user;
      return user;
    },
  });
};
export default useLogin;
