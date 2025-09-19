import { useQuery } from "@tanstack/react-query";
import type {
  UserLoginAuthDataType,
  UserLoginResponseType,
} from "../../constants/dataTypes";

const useRefreshUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/users/refresh-token`,
        {
          credentials: "include",
          method: "POST",
        }
      );
      if (!response.ok)
        throw new Error("ERROR WHILE FETCHING USER LOGIN DETAILS");
      const data: UserLoginResponseType = await response.json();
      const user: UserLoginAuthDataType = data.data;
      return user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
export default useRefreshUser;
