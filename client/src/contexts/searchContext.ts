import React from "react";
const searchContext = React.createContext<{
  searchRef: React.RefObject<HTMLInputElement> | null;
} | null>(null);

export { searchContext };
