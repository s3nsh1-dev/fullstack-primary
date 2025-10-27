import { useContext } from "react";
import { searchContext } from "../contexts/searchContext";

const useGlobalSearch = () => {
  const ctx = useContext(searchContext);
  if (!ctx) throw new Error("useSearchRef must be used inside SearchProvider");
  return ctx.searchRef;
};

export default useGlobalSearch;
