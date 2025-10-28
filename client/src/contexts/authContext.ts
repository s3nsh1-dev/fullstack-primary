import { createContext } from "react";
import type { AuthContextType } from "../constants/genericTypes";

const authContext = createContext<AuthContextType | null>(null);

export default authContext;
