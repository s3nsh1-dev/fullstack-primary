import type { TweetType } from "../../hooks/data-fetching/useFetchUserTweets";
import { Stack } from "@mui/material";
import IndividualTweet from "../Tweets/IndividualTweet";
import useAuth from "../../hooks/useAuth";
import NotLoggedIn from "../../pages/NotLoggedIn";

const ShowTweets = ({
  data,
  isError,
  isLoading,
  isFetched,
  interaction,
}: {
  data: TweetType[];
  interaction: boolean;
  isError: boolean;
  isLoading: boolean;
  isFetched: boolean;
}) => {
  const { user, loading } = useAuth();

  // While auth is still hydrating (prevents flash)
  if (!user && !loading) return <NotLoggedIn />;
  if (isLoading) return <div>...Loading Tweets</div>;
  if (isError) return <div>...Encountered Error</div>;
  if (!data && isFetched) return <div>No Tweets</div>;

  const renderTweets = data.map((tweet) => (
    <IndividualTweet key={tweet._id} tweet={tweet} interaction={interaction} />
  ));

  return <Stack spacing={1}>{renderTweets}</Stack>;
};

export default ShowTweets;
