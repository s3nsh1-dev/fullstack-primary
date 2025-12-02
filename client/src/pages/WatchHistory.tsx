import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useFetchWatchHistory from "../hooks/data-fetching/useFetchWatchHistory";
import LoadingAnimation from "../components/ui-components/LoadingAnimation";
import NotLoggedIn from "./NotLoggedIn";
import useAuth from "../hooks/useAuth";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import WatchHistoryCard from "../components/watchHistory/WatchHistoryCard";
import { Button } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";

const WatchHistory: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchWatchHistory({ limit: LIMIT });
  const { user, loading } = useAuth();
  const endDivRef = React.useRef<HTMLDivElement>(null);

  if (!user && !loading) return <NotLoggedIn />;
  if (isError)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Error fetching watch history
      </Typography>
    );
  if (isLoading) return <LoadingAnimation />;
  if (!data?.pages || data.pages.length === 0) {
    return <Typography>No Watch History Available</Typography>;
  }
  const items = data?.pages?.flatMap((page) => page.data) ?? [];

  const renderHistoryCard = items.map((video) => (
    <WatchHistoryCard key={video._id} video={video} />
  ));

  return (
    <>
      <Box p={1}>
        <HomeTabTitles
          text="Watch History"
          icon={<HistoryIcon color="secondary" />}
        />
        <Box sx={sx1}>{renderHistoryCard}</Box>
      </Box>
      <Box ref={endDivRef}></Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Button
          onClick={() => fetchNextPage()}
          variant="contained"
          color="secondary"
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </Button>
        {!hasNextPage && (
          <Typography variant="caption" color="textSecondary" p={1}>
            {data.pages[0].totalHistory} entries
          </Typography>
        )}
      </Box>
    </>
  );
};

export default WatchHistory;

const LIMIT = 8;

const sx1 = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
  overflowY: "auto",
  p: 0.5,
};
