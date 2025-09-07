import { createContext } from "react";
import type { ModeContextType } from "../constants/genericConstants";

const ModeContext = createContext<ModeContextType | null>(null);

export default ModeContext;
