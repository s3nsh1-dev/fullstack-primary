import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("q");

  return <div>{searchText}</div>;
};

export default SearchPage;
