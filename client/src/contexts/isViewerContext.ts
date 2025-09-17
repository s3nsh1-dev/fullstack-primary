import { createContext } from "react";
import type { IsViewerType } from "../constants/genericTypes";

const isViewerContext = createContext<IsViewerType | null>(null);

export default isViewerContext;
