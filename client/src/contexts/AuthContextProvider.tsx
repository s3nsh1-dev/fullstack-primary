import authContext from "./authContext";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ChildrenProps } from "../constants/genericTypes";
import type { UserLoginAuthDataType } from "../constants/dataTypes";
import { useRefreshUser } from "../hooks/data-fetching/useRefreshUser";

const AuthContextProvider: React.FC<ChildrenProps> = ({ children }) => {
  const { data: user, isLoading, isError } = useRefreshUser();
  const queryClient = useQueryClient();

  const login = useCallback(
    (userData: UserLoginAuthDataType) => {
      queryClient.setQueryData(["currentUser"], userData);
    },
    [queryClient]
  );

  const logout = useCallback(() => {
    queryClient.removeQueries({ queryKey: ["currentUser"] });
  }, [queryClient]);

  return (
    <authContext.Provider
      value={{
        user: isError ? null : user ?? null,
        login,
        logout,
        loading: isLoading,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
