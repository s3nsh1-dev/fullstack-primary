import { useContext } from "react";
import authContext from "../contexts/authContext";

const useAuth = () => {
  const contextValue = useContext(authContext);

  if (!contextValue)
    throw new Error("AuthContextProvider not wrapped correctly");
  const { user, login, logout } = contextValue;

  return { user, login, logout };
};
export default useAuth;
