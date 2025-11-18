import type { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import type { WatchHistoryVideo } from "../../hooks/data-fetching/useFetchWatchHistory";

const WatchHistoryCard: FC<{ video: WatchHistoryVideo }> = ({ video }) => {
  return (
    <Box key={video._id} sx={sx2}>
      <Box component="img" src={video.thumbnail} alt={video.title} sx={sx3} />

      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" sx={sx4}>
          {video.title || "Untitled Video"}
        </Typography>

        <Box sx={sx5}>
          <Avatar
            src={video.owner?.avatar}
            alt={video.owner?.fullname}
            sx={{ width: 24, height: 24 }}
          />
          <Typography variant="body2" color="textSecondary" sx={sx6}>
            {video.owner?.fullname || "Unknown User"}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ whiteSpace: "nowrap" }}
          >
            • {video.duration?.toFixed(2)}s
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" sx={sx7}>
          {video.description || "No description"}
        </Typography>
      </Box>
    </Box>
  );
};

export default WatchHistoryCard;

const sx2 = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  p: 1,
  borderRadius: 2,
  boxShadow: 4,
  backgroundColor: "background.paper",
  transition: "transform 0.2s",
  overflow: "hidden",
  width: "100%",
  "&:hover": { transform: "scale(0.95)" },
};
const sx3 = {
  width: 120,
  height: 70,
  objectFit: "cover",
  borderRadius: 1,
  flexShrink: 0,
};

const sx4 = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontWeight: 600,
};

const sx5 = { display: "flex", alignItems: "center", gap: 1, mt: 0.5 };

const sx6 = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const sx7 = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
