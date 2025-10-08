// import type { VideoType } from "../../constants/dataTypes";
import { Box, Typography } from "@mui/material";
import IndividualVideoUI from "../Videos/IndividualVideoUI";
import { useOutletContext } from "react-router-dom";
import type { HomePageFormatType } from "../../hooks/data-fetching/useFetchHomepageDetails";

const ShowVideos = () => {
  const { data } = useOutletContext<OutletContextType>();
  console.log(data);
  if (!data || data.user.videos.length === 0) {
    return <Typography color="textSecondary">No Videos</Typography>;
  }

  const renderVideoList = data.user.videos.map((video) => {
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

interface OutletContextType {
  data: {
    user: HomePageFormatType;
    isSubbed: boolean;
  };
  interaction: boolean;
}
