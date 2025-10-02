import type { TweetType } from "../../hooks/data-fetching/useFetchUserTweets";
import { Stack, Typography } from "@mui/material";
import IndividualTweet from "../Tweets/IndividualTweet";

const ShowTweets: React.FC<ShowTweetsProps> = ({ tweets, interaction }) => {
  if (!tweets || tweets.length === 0) {
    return <Typography color="textSecondary">No Tweets</Typography>;
  }

  const renderTweets = tweets.map((tweet) => (
    <IndividualTweet key={tweet._id} tweet={tweet} interaction={interaction} />
  ));

  return <Stack spacing={1}>{renderTweets}</Stack>;
};

export default ShowTweets;

type ShowTweetsProps = {
  tweets: TweetType[];
  interaction: boolean;
};
