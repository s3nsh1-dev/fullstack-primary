import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import ShowVideos from "../components/homepage/ShowVideos";
import useFetchUserVideos from "../hooks/data-fetching/useFetchUserVideos";
import useAuth from "../hooks/useAuth";
import { Box } from "@mui/material";
import NotLoggedIn from "./NotLoggedIn";

const MyVideos = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useFetchUserVideos(
    user?.user?._id || ""
  );
  if (isLoading || !data) return <div>...Loading My Videos</div>;
  if (isError) return <div>...Encountered Error</div>;
  if (!user) return <NotLoggedIn />;

  return (
    <Box m={1}>
      <HomeTabTitles
        text="My Videos"
        icon={
          <PlayCircleOutlineIcon sx={{ fontSize: 28, color: "primary.main" }} />
        }
      />
      <ShowVideos videos={data.videos} />
    </Box>
  );
};

export default MyVideos;
