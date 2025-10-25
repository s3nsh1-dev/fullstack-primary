import useFetchLikedContent from "../hooks/data-fetching/useFetchLikedContent";
import useAuth from "../hooks/useAuth";
import LikesList from "../components/Likes/LikesList";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import ContentNotAvailable from "../components/others/ContentNotAvailable";
import LoadingAnimation from "../components/ui-components/LoadingAnimation";
import NotLoggedIn from "./NotLoggedIn";
import Box from "@mui/material/Box";

const LikedContent = () => {
  const { user, loading } = useAuth();
  const { data, isLoading, isError } = useFetchLikedContent(
    user?.user?._id || "INVALID_USER_ID"
  );

  if (!user && !loading) return <NotLoggedIn />;
  if (isLoading) return <LoadingAnimation />;
  if (isError) return <div>...Encountered Error</div>;
  if (!data) return <ContentNotAvailable text="No Liked Content" />;

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
      <LikesList data={data} />
    </Box>
  );
};

export default LikedContent;
