import authContext from "./authContext";
import { useState } from "react";
import type { ChildrenProps } from "../constants/genericTypes";
import type {
  // UserLoginType,
  UserLoginAuthDataType,
} from "../constants/dataTypes";

const AuthContextProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [user, setUser] = useState<UserLoginAuthDataType | null>(null);
  const login = (userData: UserLoginAuthDataType) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
