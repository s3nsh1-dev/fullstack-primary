import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Visibility from "@mui/icons-material/Visibility";
import PlayArrow from "@mui/icons-material/PlayArrow";
import { formatDuration } from "../../utilities/helperFncForStats";
import type { VideoItem } from "../../hooks/data-fetching/useFetchFeed";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";

const VideoCard: React.FC<{ video: VideoItem }> = ({ video }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/videos/${video._id}`);
  };

  return (
    <Card sx={sxValue} elevation={10}>
      <CardContent sx={sxV2}>
        <UserHeader
          owner={video.owner}
          createdAt={video.createdAt}
          isTweet={false}
        />
        <Box
          sx={{ position: "relative", cursor: "pointer" }}
          onClick={handleCardClick}
        >
          <CardMedia
            component="img"
            image={video.thumbnail}
            alt={video.title}
            sx={mediaStyle}
          />
          <Box sx={playButtonStyle}>
            <IconButton sx={playIconStyle}>
              <PlayArrow sx={{ fontSize: 40 }} color="secondary" />
            </IconButton>
          </Box>
          <Chip
            label={formatDuration(video.duration)}
            size="small"
            sx={durationChipStyle}
          />
        </Box>
        <Box mt={2}>
          <Typography variant="body1" fontWeight={600} gutterBottom>
            {video.title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={descriptionStyle}
          >
            {video.description}
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            color="text.secondary"
          >
            <Visibility fontSize="small" />
            <Typography variant="caption">
              {video.views.toLocaleString()} views
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoCard;

const sxValue = {
  width: "100%",
  "&:hover": { boxShadow: 3 },
  transition: "box-shadow 0.3s",
};

const sxV2 = {
  "&:last-child": {
    paddingBottom: "10px",
  },
  padding: "10px",
};

const descriptionStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  fontSize: 14,
  mb: 1,
};

const playButtonStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,0.3)",
  borderRadius: 1,
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
};

const durationChipStyle = {
  position: "absolute",
  bottom: 8,
  right: 8,
  backgroundColor: "rgba(0,0,0,0.8)",
  color: "white",
  fontWeight: 600,
};

const mediaStyle = {
  borderRadius: 1,
  backgroundColor: "grey.900",
  height: 150,
};

const playIconStyle = {
  backgroundColor: "rgba(255,255,255,0.9)",
  "&:hover": { backgroundColor: "white" },
};
