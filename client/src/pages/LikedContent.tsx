import useFetchLikedContent from "../hooks/data-fetching/useFetchLikedContent";
import useAuth from "../hooks/useAuth";
import LikesList from "../components/homepage/LikesList";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";

const LikedContent = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useFetchLikedContent(
    user?.user?._id || ""
  );
  if (isLoading) return <div>...Loading Liked Content</div>;
  if (isError) return <div>...Encountered Error</div>;
  if (!data) return <div>No Liked Content</div>;

  return (
    <div>
      <HomeTabTitles
        text="Liked Content"
        icon={
          <FavoriteBorderOutlinedIcon
            sx={{ fontSize: 28, color: "primary.main" }}
          />
        }
      />
      <LikesList data={data} />
    </div>
  );
};

export default LikedContent;
