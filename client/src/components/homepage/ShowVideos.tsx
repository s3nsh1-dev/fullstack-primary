import { Box, Typography } from "@mui/material";
import IndividualVideoUI from "../Videos/IndividualVideoUI";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import useAuth from "../../hooks/useAuth";
import useFetchUserVideos from "../../hooks/data-fetching/useFetchUserVideos";

const ShowVideos = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useFetchUserVideos(
    user?.user?._id || ""
  );
  if (isLoading) return <CircularProgressCenter />;
  if (isError) return <div>...Encountered Error</div>;
  if (!data || data.videos.length === 0) {
    return <Typography color="textSecondary">No Videos</Typography>;
  }

  const renderVideoList = data.videos?.map((video) => {
    return <IndividualVideoUI video={video} key={video._id} />;
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      {renderVideoList}
    </Box>
  );
};
export default ShowVideos;
