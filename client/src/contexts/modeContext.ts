import { createContext } from "react";
import type { ModeContextType } from "../constants/genericConstants";

const ModeContext = createContext<ModeContextType>({
  mode: true,
  changeMode: () => {},
});

export default ModeContext;
