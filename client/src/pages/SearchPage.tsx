import { useSearchParams } from "react-router-dom";
import useSearchUserQuery from "../hooks/searching/useSearchUserQuery";
import LoadingAnimation from "../components/ui-components/LoadingAnimation";
import ContentNotAvailable from "../components/others/ContentNotAvailable";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("q");
  const { data, isLoading, isError } = useSearchUserQuery(searchText || "");

  if (isLoading) return <LoadingAnimation />;
  if (isError) return <div>...Encountered Error</div>;
  if (!data || "result" in data.data)
    return <ContentNotAvailable text="No Matching result" />;

  return <div>{JSON.stringify(data)}</div>;
};

export default SearchPage;
