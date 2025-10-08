import { Stack, Typography } from "@mui/material";
import IndividualTweet from "../Tweets/IndividualTweet";
import { useOutletContext } from "react-router-dom";
import type { HomePageFormatType } from "../../hooks/data-fetching/useFetchHomepageDetails";

const ShowTweets = () => {
  const { data, interaction } = useOutletContext<OutletContextType>();
  if (!data.user.tweets || data.user.tweets.length === 0) {
    return <Typography color="textSecondary">No Tweets</Typography>;
  }

  const renderTweets = data.user.tweets.map((tweet) => (
    <IndividualTweet key={tweet._id} tweet={tweet} interaction={interaction} />
  ));

  return <Stack spacing={1}>{renderTweets}</Stack>;
};

export default ShowTweets;

interface OutletContextType {
  data: {
    user: HomePageFormatType;
    isSubbed: boolean;
  };
  interaction: boolean;
}
