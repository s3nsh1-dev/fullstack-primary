import authContext from "./authContext";
import { useState, useEffect } from "react";
import type { ChildrenProps } from "../constants/genericTypes";
import type { UserLoginAuthDataType } from "../constants/dataTypes";
import useRefreshUser from "../hooks/data-fetching/useRefreshUser";

const AuthContextProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserLoginAuthDataType | null>(null);
  const login = (userData: UserLoginAuthDataType) => setUser(userData);
  const logout = () => setUser(null);
  // const { mutate: refreshUser } = useRefreshUser();
  const callRefreshToken = useRefreshUser();

  useEffect(() => {
    callRefreshToken.mutate(undefined, {
      onSuccess: (data) => {
        setUser(data);
      },
      onError: () => {
        setUser(null);
      },
      // onSettled solved my problem of !data return <>...No data</>
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
