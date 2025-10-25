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
      <CardContent>
        <UserHeader
          owner={video.owner}
          createdAt={video.createdAt}
          isTweet={false}
        />

        <Box
          position="relative"
          sx={{ cursor: "pointer" }}
          onClick={handleCardClick}
        >
          <CardMedia
            component="img"
            height="300"
            image={video.thumbnail}
            alt={video.title}
            sx={{
              borderRadius: 1,
              backgroundColor: "grey.900",
            }}
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
            }}
          >
            <IconButton
              sx={{
                backgroundColor: "rgba(255,255,255,0.9)",
                "&:hover": { backgroundColor: "white" },
              }}
            >
              <PlayArrow sx={{ fontSize: 40 }} color="secondary" />
            </IconButton>
          </Box>
          <Chip
            label={formatDuration(video.duration)}
            size="small"
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "white",
              fontWeight: 600,
            }}
          />
        </Box>
        <Box mt={2}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {video.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
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
  maxWidth: 600,
  width: "100%",
  //   boxShadow: 1,
  "&:hover": { boxShadow: 3 },
  transition: "box-shadow 0.3s",
};
