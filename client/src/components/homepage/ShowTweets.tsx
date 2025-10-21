import React from "react";
import { Stack } from "@mui/material";
import IndividualTweet from "../Tweets/IndividualTweet";
import useFetchUserTweets from "../../hooks/data-fetching/useFetchUserTweets";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingAnimation from "../ui-components/LoadingAnimation";

const ShowTweets: React.FC<ShowTweetType> = ({ interaction }) => {
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const { user } = useAuth();

  const effectiveUserId = outletContext?.userId ?? user?.user?._id ?? "";

  const { data, isError, isLoading } = useFetchUserTweets(effectiveUserId);
  if (isLoading) return <LoadingAnimation />;
  if (isError) return <div>...Encountered Error</div>;
  if (!data || data?.length === 0) return <div>No Tweets</div>;

  const renderTweets = data?.map((tweet) => (
    <IndividualTweet key={tweet._id} tweet={tweet} interaction={interaction} />
  ));

  return <Stack spacing={1}>{renderTweets}</Stack>;
};

export default ShowTweets;

type ShowTweetType = {
  interaction: boolean;
};

type OutletContextType = {
  userId: string;
};
