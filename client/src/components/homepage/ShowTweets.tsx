import type { TweetType } from "../../hooks/data-fetching/useFetchUserTweets";
import { Stack } from "@mui/material";
import IndividualTweet from "../Tweets/IndividualTweet";

const ShowTweets = ({
  tweets,
  interaction,
}: {
  tweets: TweetType[];
  interaction: boolean;
}) => {
  const renderTweets = tweets.map((tweet) => (
    <IndividualTweet key={tweet._id} tweet={tweet} interaction={interaction} />
  ));

  return <Stack spacing={1}>{renderTweets}</Stack>;
};

export default ShowTweets;
