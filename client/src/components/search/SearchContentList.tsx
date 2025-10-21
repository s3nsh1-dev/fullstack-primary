import React from "react";
import type {
  UserSearchResult,
  VideoSearchResult,
  TweetSearchResult,
} from "../../hooks/searching/useSearchUserQuery";
import SearchResultTweet from "./SearchResultTweet";
import SearchResultVideos from "./SearchResultVideos";
import SearchResultUser from "./SearchResultUser";

const SearchContentList: React.FC<PropType> = ({ searchList }) => {
  return (
    <>
      <SearchResultUser users={searchList?.user} />
      <SearchResultTweet tweets={searchList?.tweet} />
      <SearchResultVideos videos={searchList?.video} />
    </>
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
