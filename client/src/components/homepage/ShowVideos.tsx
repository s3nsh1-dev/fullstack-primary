import type { VideoType } from "../../constants/dataTypes";
import { Box, Typography } from "@mui/material";
import IndividualVideoUI from "../Videos/IndividualVideoUI";

const ShowVideos = ({ videos }: { videos: VideoType[] }) => {
  if (!videos || videos.length === 0) {
    return <Typography color="textSecondary">No Videos</Typography>;
  }

  const renderVideoList = videos.map((video) => {
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
