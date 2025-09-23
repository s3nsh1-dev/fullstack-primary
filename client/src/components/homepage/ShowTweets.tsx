import type { TweetType } from "../../constants/dataTypes";
import { Typography, Stack } from "@mui/material";
import IndividualTweet from "../Tweets/IndividualTweet";

const ShowTweets = ({
  tweets,
  interaction,
}: {
  tweets: TweetType[];
  interaction: boolean;
}) => {
  if (!tweets || tweets.length === 0) {
    return <Typography color="textSecondary">No tweets to show.</Typography>;
  }

  const renderTweets = tweets.map((tweet) => (
    <IndividualTweet key={tweet._id} tweet={tweet} interaction={interaction} />
  ));

  return <Stack spacing={1}>{renderTweets}</Stack>;
};

export default ShowTweets;
