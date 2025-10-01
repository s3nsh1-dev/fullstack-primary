import useFetchSingleTweet from "../hooks/data-fetching/useFetchSingleTweet";
import IndividualTweet from "../components/Tweets/IndividualTweet";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

const OpenSingleTweetPage = () => {
  const { tweetId } = useParams<{ tweetId: string }>(); // fetch param from URL
  const { data, isLoading, isError } = useFetchSingleTweet(
    tweetId || "INVALID_TWEET-ID"
  );
  console.log(data, isLoading, isError);
  if (isLoading) return <div>...Loading Single Tweet</div>;
  if (isError) return <div>...Encountered Error</div>;
  if (!data) return <div>Tweet Not Available</div>;
  return (
    <Box m={1}>
      <IndividualTweet interaction={true} tweet={data} />
    </Box>
  );
};

export default OpenSingleTweetPage;
