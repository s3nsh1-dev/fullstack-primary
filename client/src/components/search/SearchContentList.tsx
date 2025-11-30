import React from "react";
import type {
  UserSearchResult,
  VideoSearchResult,
  TweetSearchResult,
} from "../../hooks/searching/useSearchUserQuery";
import SearchResultTweet from "./SearchResultTweet";
import SearchResultVideos from "./SearchResultVideos";
import SearchResultUser from "./SearchResultUser";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ShuffleSearchResult from "./ShuffleSearchResult";
import { useSearchParams } from "react-router-dom";

const SearchContentList: React.FC<PropType> = ({ searchList }) => {
  // currentFilter, searchParams, setSearchParams act like a state provided by react router
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "All";

  const merge = React.useMemo(
    () =>
      shuffleAndMerge(
        searchList?.user || [],
        searchList?.video || [],
        searchList?.tweet || []
      ),
    [searchList]
  );

  const handleButtonClick = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("filter", value);
    // changing URL re-renders the main SearchPage, hence all children components are re-rendered
    setSearchParams(newParams);
  };

  const renderContent = () => {
    switch (currentFilter) {
      case "All":
        return <ShuffleSearchResult result={merge} />;
      case "Accounts":
        return <SearchResultUser users={searchList?.user} />;
      case "Videos":
        return <SearchResultVideos videos={searchList?.video} />;
      case "Tweets":
        return <SearchResultTweet tweets={searchList?.tweet} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
        {["All", "Accounts", "Videos", "Tweets"].map((item) => (
          <Button
            key={item}
            variant={currentFilter === item ? "contained" : "outlined"}
            color="secondary"
            sx={buttonSx}
            onClick={() => handleButtonClick(item)}
          >
            {item}
          </Button>
        ))}
      </Box>
      {renderContent()}
    </Box>
  );
};

export default SearchContentList;

type PropType = {
  searchList: {
    user: UserSearchResult[];
    video: VideoSearchResult[];
    tweet: TweetSearchResult[];
  };
};

const buttonSx = {
  height: `30px`,
  fontSize: `12px`,
};

function shuffleAndMerge(
  a: UserSearchResult[],
  b: VideoSearchResult[],
  c: TweetSearchResult[]
): MergeArrayType[] {
  const merged = [...a, ...b, ...c];

  for (let i = merged.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [merged[i], merged[j]] = [merged[j], merged[i]];
  }

  return merged;
}

type MergeArrayType = UserSearchResult | VideoSearchResult | TweetSearchResult;
