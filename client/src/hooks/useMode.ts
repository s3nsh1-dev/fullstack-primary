import { useContext } from "react";
import ModeContext from "../contexts/modeContext";

const useMode = () => {
  const modeContextType = useContext(ModeContext);
  if (!modeContextType) throw new Error("MODE_CONTEXT NOT FOUND");
  const { mode, changeMode } = modeContextType;

  return { mode, changeMode };
};
export default useMode;
