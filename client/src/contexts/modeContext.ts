import { createContext } from "react";
import type { ModeContextType } from "../constants/genericTypes";

const ModeContext = createContext<ModeContextType | null>(null);

export default ModeContext;
