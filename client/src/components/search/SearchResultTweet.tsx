import React from "react";
import type { TweetSearchResult } from "../../hooks/searching/useSearchUserQuery";

const SearchResultTweet: React.FC<PropType> = ({ tweets }) => {
  if (tweets?.length === 0) return <div></div>;
  return <div></div>;
};

export default SearchResultTweet;

type PropType = {
  tweets: TweetSearchResult[];
};
