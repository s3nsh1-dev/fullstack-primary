import type { TweetType } from "../../hooks/data-fetching/useFetchUserTweets";
import { Stack } from "@mui/material";
import IndividualTweet from "../Tweets/IndividualTweet";

const ShowTweets: React.FC<ShowTweetsProps> = ({ data, interaction }) => {
  const renderTweets = data.map((tweet) => (
    <IndividualTweet key={tweet._id} tweet={tweet} interaction={interaction} />
  ));

  return <Stack spacing={1}>{renderTweets}</Stack>;
};

export default ShowTweets;

type ShowTweetsProps = {
  data: TweetType[];
  interaction: boolean;
};
