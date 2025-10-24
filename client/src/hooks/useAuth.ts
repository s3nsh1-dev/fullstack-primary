import { useContext } from "react";
import authContext from "../contexts/authContext";

const useAuth = () => {
  const contextValue = useContext(authContext);

  if (!contextValue)
    throw new Error("AuthContextProvider not wrapped correctly");
  const { user, login, logout, loading } = contextValue;

  console.log("hook");

  return { user, login, logout, loading };
};
export default useAuth;
