import React from "react";
import type { TweetSearchResult } from "../../hooks/searching/useSearchUserQuery";
import IndividualTweet from "../Tweets/IndividualTweet";
import Typography from "@mui/material/Typography";

const SearchResultTweet: React.FC<PropType> = ({ tweets }) => {
  if (!tweets || tweets.length === 0) {
    return (
      <Typography
        color="textSecondary"
        sx={{ textAlign: "center", padding: "10px" }}
      >
        No Tweets
      </Typography>
    );
  }
  const renderMatchingTweets = tweets.map((tweet) => {
    return (
      <IndividualTweet
        key={tweet?._id}
        tweet={tweet}
        interaction={false}
        isLiked={tweet.isLiked}
      />
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
