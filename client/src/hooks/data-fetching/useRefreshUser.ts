import { useMutation } from "@tanstack/react-query";
import type { UserLoginResponseType } from "../../constants/responseTypes";

const useRefreshUser = () => {
  return useMutation({
    mutationKey: ["currentUser"],
    mutationFn: async () => {
      console.log("refreshing user API");
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
      const user = data.data;
      return user;
    },
  });
};
export default useRefreshUser;
