import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IndividualTweet from "../Tweets/IndividualTweet";
import Pagination from "@mui/material/Pagination";
import useFetchUserTweets from "../../hooks/data-fetching/useFetchUserTweets";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingAnimation from "../ui-components/LoadingAnimation";
import { useSearchParams } from "react-router-dom";

const ShowTweets: React.FC<ShowTweetType> = ({ interaction, pageLimit }) => {
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const effectiveUserId = outletContext?.userId ?? user?.user?._id ?? "";
  const currentPage = searchParams.get("page") || 1;

  const { data, isError, isLoading } = useFetchUserTweets({
    userId: effectiveUserId,
    page: Number(currentPage),
    limit: pageLimit || 4,
  });

  if (isLoading) return <LoadingAnimation />;
  if (isError) return <div>...Encountered Error</div>;
  if (!data || data?.tweets?.length === 0) return <div>No Tweets</div>;

  const handlePagination = (value: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", value.toString());
    setSearchParams(newParams);
  };

  const renderTweets = data?.tweets?.map((item) => {
    return (
      <IndividualTweet
        key={item._id}
        tweet={item}
        interaction={interaction}
        isLiked={item.isLiked}
      />
    );
  });

  return (
    <Box>
      <Typography variant="caption" color="textSecondary">
        Total Tweets: {data.totalTweets}
      </Typography>
      <Stack spacing={1}>{renderTweets}</Stack>
      <Stack alignItems={"center"} pt={2}>
        <Pagination
          shape="rounded"
          variant="outlined"
          color="secondary"
          count={data.totalPages}
          page={data.currentPage}
          onChange={(_, value) => handlePagination(value)}
          showFirstButton
          showLastButton
        />
      </Stack>
    </Box>
  );
};

export default ShowTweets;

type ShowTweetType = {
  interaction: boolean;
  pageLimit: number;
};

type OutletContextType = {
  userId: string;
};
