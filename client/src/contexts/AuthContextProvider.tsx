import authContext from "./authContext";
import { useState, useEffect, useCallback } from "react";
import type { ChildrenProps } from "../constants/genericTypes";
import type { UserLoginAuthDataType } from "../constants/dataTypes";
import useRefreshUser from "../hooks/data-fetching/useRefreshUser";

const AuthContextProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserLoginAuthDataType | null>(null);
  // const login = (userData: UserLoginAuthDataType) => setUser(userData);
  const login = useCallback(
    (userData: UserLoginAuthDataType) =>
      setUser((prev) =>
        prev?.user?._id === userData?.user?._id ? prev : userData
      ),
    []
  );
  const logout = useCallback(() => setUser(null), []);
  const callRefreshToken = useRefreshUser();
  console.log("Provider", user, loading);

  useEffect(() => {
    callRefreshToken.mutate(undefined, {
      onSuccess: (data) => {
        setUser((prev) => {
          return prev?.user?._id === data?.user?._id ? prev : data;
        });
      },
      onError: () => {
        setUser(null);
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  }, []);

  return (
    <authContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
