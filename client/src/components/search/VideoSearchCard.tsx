import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import {
  formatViews,
  formatDuration,
  getTimeAgo,
} from "../../utilities/helperFncForStats";
import type { VideoSearchResult } from "../../hooks/searching/useSearchUserQuery";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";

export const VideoSearchCard: React.FC<VideoSearchCardProps> = ({
  video,
  onClick,
}) => {
  return (
    <Card onClick={onClick} sx={cardSx}>
      {/* Thumbnail Section */}
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        <CardMedia
          component="img"
          sx={imageSx}
          image={
            video.thumbnail ||
            "https://via.placeholder.com/246x138?text=No+Thumbnail"
          }
          alt={video.title}
        />
        <Chip label={formatDuration(video.duration)} size="small" sx={chipSx} />
      </Box>
      {/* Content Section */}
      <Box
        sx={{
          p: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={titleSx}>
            {video.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {formatViews(video.views)} views • {getTimeAgo(video.createdAt)}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Avatar
              src={video.owner.avatar}
              alt={video.owner.username}
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="body2" color="text.secondary">
              {video.owner.fullname || video.owner.username}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={descriptionSx}>
            {video.description}
          </Typography>
        </Box>
        <OndemandVideoIcon color="error" fontSize="small" />
      </Box>
    </Card>
  );
};

interface VideoSearchCardProps {
  video: VideoSearchResult;
  onClick?: () => void;
}

const cardSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  cursor: "pointer",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: "action.hover",
  },
  boxShadow: "none",
  border: "1px solid",
  borderColor: "divider",
};
const chipSx = {
  position: "absolute",
  bottom: 8,
  right: 8,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  color: "white",
  fontWeight: 600,
  fontSize: "0.75rem",
  height: 20,
};
const titleSx = {
  fontWeight: 500,
  mb: 0.5,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  lineHeight: 1.4,
};
const descriptionSx = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
};

const imageSx = {
  width: { xs: "100%", sm: 246 },
  height: { xs: "130px", sm: 138 },
  objectFit: "cover",
};
