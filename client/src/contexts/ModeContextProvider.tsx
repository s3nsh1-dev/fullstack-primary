import { useState, type FC } from "react";
import ModeContext from "./modeContext";
import type { ModeType } from "../constants/genericConstants";

type ModeContextProviderType = {
  children: React.ReactNode;
};

const getStoredMode = (): ModeType => {
  return localStorage.getItem("mode") === "true";
};

const ModeContextProvider: FC<ModeContextProviderType> = ({ children }) => {
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
