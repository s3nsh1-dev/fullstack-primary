import { useState, type FC } from "react";
import isViewerContext from "./isViewerContext";
import type { ChildrenProps } from "../constants/genericTypes";

const IsViewerContextProvider: FC<ChildrenProps> = ({ children }) => {
  const [isViewer, setIsViewer] = useState<boolean>(false);
  const toggleViewer = () => {
    setIsViewer((prev) => !prev);
  };
  return (
    <isViewerContext.Provider value={{ isViewer, toggleViewer }}>
      {children}
    </isViewerContext.Provider>
  );
};

export default IsViewerContextProvider;
