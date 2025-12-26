import useFetchFeed from "../hooks/data-fetching/useFetchFeed";
import CircularProgressCenter from "../components/ui-components/CircularProgressCenter";
import FeedItem from "../components/dashboard/FeedItem";
import Masonry from "@mui/lab/Masonry";
import LoadingAnimation from "../components/ui-components/LoadingAnimation";
// import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

const Dashboard = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchFeed(30);

  const observerTarget = useIntersectionObserver(fetchNextPage, !!hasNextPage);

  if (isLoading) return <LoadingAnimation />;
  if (isError) return <Box> SITE IS FACING SOME INTERNAL ISSUES</Box>;
  if (!data) return <CircularProgressCenter size={80} />;

  const renderFeeds = data.pages
    .flatMap((page) => page.feed)
    .map((item) => <FeedItem key={item._id} item={item} />);

  return (
    <>
      <Masonry columns={responsiveColumns} spacing={2} sx={masonryStyle}>
        {renderFeeds}
      </Masonry>
      <div ref={observerTarget}></div>
      <Box sx={contStyle}>
        {isFetchingNextPage && <CircularProgressCenter size={50} />}
        {/* change the button to infinite scroll when enough content in database */}
        {/* <Button
          onClick={() => fetchNextPage()}
          variant="contained"
          color="primary"
          disabled={isFetchingNextPage || !hasNextPage}
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </Button> */}
        {!hasNextPage && (
          <Typography variant="caption" color="textSecondary">
            You reached THE END of your feed
          </Typography>
        )}
      </Box>
    </>
  );
};

export default Dashboard;

const contStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
};

const masonryStyle = {
  margin: "auto",
  padding: 1,
};

const responsiveColumns = { xs: 1, sm: 2, md: 3, xl: 4 };
