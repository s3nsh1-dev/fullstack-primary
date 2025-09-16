import { useState, type FC } from "react";
import ModeContext from "./modeContext";
import type { ModeType } from "../constants/genericTypes";
import type { ChildrenProps } from "../constants/genericTypes";

const getStoredMode = (): ModeType => {
  return localStorage.getItem("mode") === "true";
};

const ModeContextProvider: FC<ChildrenProps> = ({ children }) => {
  const [mode, setMode] = useState<ModeType>(getStoredMode);

  const handleModeType = () => {
    setMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("mode", String(newMode));
      return newMode;
    });
  };

  const modeContextValue = { mode, changeMode: handleModeType };

  return (
    <ModeContext.Provider value={modeContextValue}>
      {children}
    </ModeContext.Provider>
  );
};

export default ModeContextProvider;
