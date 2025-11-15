import React from "react";
import Stack from "@mui/material/Stack";
import IndividualTweet from "../Tweets/IndividualTweet";
import Pagination from "@mui/material/Pagination";
import useFetchUserTweets from "../../hooks/data-fetching/useFetchUserTweets";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingAnimation from "../ui-components/LoadingAnimation";

const ShowTweets: React.FC<ShowTweetType> = ({ interaction, pageLimit }) => {
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const { user } = useAuth();

  const effectiveUserId = outletContext?.userId ?? user?.user?._id ?? "";
  const [page, setPage] = React.useState(1);

  const { data, isError, isLoading } = useFetchUserTweets({
    userId: effectiveUserId,
    page,
    limit: pageLimit || 4,
  });

  if (isLoading) return <LoadingAnimation />;
  if (isError) return <div>...Encountered Error</div>;
  if (!data || data?.tweets?.length === 0) return <div>No Tweets</div>;

  const handlePagination = (value: number) => {
    setPage(value);
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
    <Stack spacing={1}>
      {renderTweets}
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
    </Stack>
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
