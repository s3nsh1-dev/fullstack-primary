import authContext from "./authContext";
import { useState } from "react";
import type { AuthContextProviderType } from "../constants/genericTypes";
import type { UserLoginType } from "../constants/dataTypes";

const AuthContextProvider: React.FC<AuthContextProviderType> = ({
  children,
}) => {
  const [user, setUser] = useState<UserLoginType | null>(null);
  const login = (userData: UserLoginType) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
