import { useContext } from "react";
import ModeContext from "../contexts/modeContext";

const useMode = () => {
  const contextValue = useContext(ModeContext);

  if (!contextValue)
    throw new Error("ModeContextProvider not Wrapped correctly");
  const { mode, changeMode } = contextValue;

  return { mode, changeMode };
};
export default useMode;
