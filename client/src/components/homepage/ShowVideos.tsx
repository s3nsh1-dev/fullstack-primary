import { Box, Typography } from "@mui/material";
import IndividualVideoUI from "../Videos/IndividualVideoUI";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import useFetchUserVideos from "../../hooks/data-fetching/useFetchUserVideos";
import { useOutletContext } from "react-router-dom";

const ShowVideos = () => {
  const { userId } = useOutletContext<OutletContextType>();

  const { data, isLoading, isError } = useFetchUserVideos(userId || "");

  if (isError) return <div>...Encountered Error</div>;
  if (isLoading) return <CircularProgressCenter />;
  if (!data || data.videos?.length === 0) {
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

type OutletContextType = {
  userId: string;
};
