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

const SearchContentList: React.FC<PropType> = ({ searchList }) => {
  const [selectedButton, setSelectedButton] = React.useState("All");

  const handleButtonClick = (value: string) => {
    setSelectedButton(value);
  };

  const renderContent = () => {
    switch (selectedButton) {
      case "All":
        return (
          <ShuffleSearchResult
            users={searchList?.user}
            videos={searchList?.video}
            tweets={searchList?.tweet}
          />
        );
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
            variant={selectedButton === item ? "contained" : "outlined"}
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
