import useFetchLikedContent from "../hooks/data-fetching/useFetchLikedContent";
import useAuth from "../hooks/useAuth";
import LikesList from "../components/Likes/LikesList";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import ContentNotAvailable from "../components/others/ContentNotAvailable";
import LoadingAnimation from "../components/ui-components/LoadingAnimation";
import NotLoggedIn from "./NotLoggedIn";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgressCenter from "../components/ui-components/CircularProgressCenter";

const LikedContent = () => {
  const { user, loading } = useAuth();
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFetchLikedContent({
    userId: user?.user?._id || "INVALID_USER_ID",
    limit: LIMIT,
  });

  if (!user && !loading) return <NotLoggedIn />;
  if (isLoading) return <LoadingAnimation />;
  if (isError) return <div>...Encountered Error</div>;
  if (!data || data.pages.length === 0)
    return <ContentNotAvailable text="No Liked Content" />;

  console.log("see", data.pages[0].liked);

  return (
    <Box p={1}>
      <HomeTabTitles
        text="Liked Content"
        icon={
          <FavoriteBorderOutlinedIcon
            sx={{ fontSize: 28, color: "primary.main" }}
          />
        }
      />
      <Typography variant="caption" color="textSecondary">
        Liked Content {data.pages[0].totalDocs}
      </Typography>
      <LikesList data={data.pages[0].liked} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 2,
        }}
      >
        {isFetchingNextPage ? (
          <CircularProgressCenter size={20} />
        ) : (
          <>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage}
            >
              Load More
            </Button>
          </>
        )}
        {hasNextPage ? (
          <></>
        ) : (
          <Typography variant="caption" color="textSecondary">
            All {data.pages[0].totalPages} pages loaded
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LikedContent;

const LIMIT = 2;
