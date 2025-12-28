import useFetchLikedContent from "../hooks/data-fetching/useFetchLikedContent";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import useAuth from "../hooks/useAuth";
import LikesList from "../components/Likes/LikesList";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import ContentNotAvailable from "../components/others/ContentNotAvailable";
import LoadingAnimation from "../components/ui-components/LoadingAnimation";
import NotLoggedIn from "./NotLoggedIn";
import Box from "@mui/material/Box";
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

  const observerTarget = useIntersectionObserver(fetchNextPage, !!hasNextPage);

  if (!user && !loading) return <NotLoggedIn />;
  if (isLoading) return <LoadingAnimation />;
  if (isError) return <div>...Encountered Error</div>;
  if (!data || data.pages.length === 0)
    return <ContentNotAvailable text="No Liked Content" />;

  return (
    <Box p={2}>
      <HomeTabTitles
        text="Liked Content"
        icon={<FavoriteBorderOutlinedIcon color="secondary" />}
      />
      <Typography pb={1} fontSize={13} color="textSecondary">
        Liked Content: {data.pages[0].totalDocs}
      </Typography>
      <LikesList data={data.pages.flatMap((page) => page.liked)} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {isFetchingNextPage && <CircularProgressCenter size={20} />}
        {!hasNextPage && (
          <Typography variant="caption" color="textSecondary" p={1}>
            {data.pages[0].totalDocs} entries . The End
          </Typography>
        )}
      </Box>
      <div ref={observerTarget} />
    </Box>
  );
};

export default LikedContent;

const LIMIT = 7;
