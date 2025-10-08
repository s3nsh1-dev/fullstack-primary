import React from "react";
import { Stack } from "@mui/material";
import IndividualTweet from "../Tweets/IndividualTweet";
import useAuth from "../../hooks/useAuth";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import useFetchUserTweets from "../../hooks/data-fetching/useFetchUserTweets";

const ShowTweets: React.FC<ShowTweetType> = ({ interaction }) => {
  const { user } = useAuth();
  const { data, isError, isLoading } = useFetchUserTweets(
    user?.user?._id || ""
  );
  if (isLoading)
    return (
      <div>
        <CircularProgressCenter />
      </div>
    );
  if (isError) return <div>...Encountered Error</div>;
  if (!data || data.length === 0) return <div>No Tweets</div>;

  const renderTweets = data?.map((tweet) => (
    <IndividualTweet key={tweet._id} tweet={tweet} interaction={interaction} />
  ));

  return <Stack spacing={1}>{renderTweets}</Stack>;
};

export default ShowTweets;

type ShowTweetType = {
  interaction: boolean;
};
