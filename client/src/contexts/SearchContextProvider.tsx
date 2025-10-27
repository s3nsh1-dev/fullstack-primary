import { searchContext } from "./searchContext";
import React from "react";
import type { ChildrenProps } from "../constants/genericTypes";

const SearchContextProvider: React.FC<ChildrenProps> = ({ children }) => {
  const searchRef = React.useRef<HTMLInputElement>(null!);
  return (
    <searchContext.Provider value={{ searchRef }}>
      {children}
    </searchContext.Provider>
  );
};

export default SearchContextProvider;
