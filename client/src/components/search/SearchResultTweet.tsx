import React from "react";
import type { TweetSearchResult } from "../../hooks/searching/useSearchUserQuery";
import IndividualTweet from "../Tweets/IndividualTweet";

const SearchResultTweet: React.FC<PropType> = ({ tweets }) => {
  if (tweets?.length === 0) return <div></div>;
  const renderMatchingTweets = tweets.map((tweet) => {
    return (
      <IndividualTweet key={tweet._id} tweet={tweet} interaction={false} />
    );
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {renderMatchingTweets}
    </div>
  );
};

export default SearchResultTweet;

type PropType = {
  tweets: TweetSearchResult[];
};
