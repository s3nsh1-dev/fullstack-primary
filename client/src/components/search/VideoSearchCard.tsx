import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Box,
  Chip,
} from "@mui/material";
import {
  formatViews,
  formatDuration,
  getTimeAgo,
} from "../../utilities/helperFncForStats";
import type { VideoSearchResult } from "../../hooks/searching/useSearchUserQuery";

export const VideoSearchCard: React.FC<VideoSearchCardProps> = ({
  video,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "row",
        cursor: "pointer",
        transition: "background-color 0.2s",
        "&:hover": {
          backgroundColor: "action.hover",
        },
        boxShadow: "none",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Thumbnail Section */}
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        <CardMedia
          component="img"
          sx={{
            width: 246,
            height: 138,
            objectFit: "cover",
          }}
          image={
            video.thumbnail ||
            "https://via.placeholder.com/246x138?text=No+Thumbnail"
          }
          alt={video.title}
        />
        {/* Duration Badge */}
        <Chip
          label={formatDuration(video.duration)}
          size="small"
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            fontWeight: 600,
            fontSize: "0.75rem",
            height: 20,
          }}
        />
      </Box>

      {/* Content Section */}
      <CardContent sx={{ flex: 1, py: 1, px: 2 }}>
        {/* Title */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.4,
          }}
        >
          {video.title}
        </Typography>

        {/* Views and Date */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {formatViews(video.views)} views • {getTimeAgo(video.createdAt)}
        </Typography>

        {/* Channel Info */}
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

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {video.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

interface VideoSearchCardProps {
  video: VideoSearchResult;
  onClick?: () => void;
}
