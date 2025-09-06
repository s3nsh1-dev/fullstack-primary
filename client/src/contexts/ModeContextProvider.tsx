import { useState, type FC } from "react";
import ModeContext from "./modeContext";
import type { ModeType } from "../constants/genericConstants";

type ModeContextProviderType = {
  children: React.ReactNode;
};

const ModeContextProvider: FC<ModeContextProviderType> = ({ children }) => {
  const localStorageModeValue = Boolean(localStorage.getItem("mode"));
  const [mode, setMode] = useState<ModeType>(localStorageModeValue || true);

  const handleModeType = () => {
    setMode((prevMode) => !prevMode);
    localStorage.setItem("mode", String(mode));
  };

  const modeContextValue = { mode, changeMode: handleModeType };

  return (
    <ModeContext.Provider value={modeContextValue}>
      {children}
    </ModeContext.Provider>
  );
};

export default ModeContextProvider;
