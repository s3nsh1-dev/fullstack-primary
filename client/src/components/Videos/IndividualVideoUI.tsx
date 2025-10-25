import React from "react";
import type { VideoType } from "../../constants/dataTypes";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import useMode from "../../hooks/useMode";
import { useNavigate } from "react-router-dom";

const IndividualVideoUI: React.FC<{ video: VideoType }> = ({ video }) => {
  const navigate = useNavigate();
  const { mode } = useMode();
  return (
    <Box
      key={video._id}
      sx={{
        width: 300,
        borderRadius: 1,
        boxShadow: 5,
        // border: "1px solid purple",
        backgroundColor: "background.paper",
        overflow: "hidden",
        "&:hover": { boxShadow: 3 },
      }}
    >
      {/* Thumbnail with Play Icon */}
      <Box sx={{ position: "relative", cursor: "pointer" }}>
        <Box
          component="img"
          src={video.thumbnail}
          alt={video.title}
          sx={{
            width: "100%",
            height: 160,
            objectFit: "cover",
            display: "block",
            borderRadius: 1,
          }}
        />

        {/* Semi-transparent overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: 1,
          }}
        />

        {/* Play Button */}
        <IconButton
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            fontSize: 90,
            backgroundColor: "transparent",
            transform: "translate(-50%, -50%)",
            color: "rgba(255,255,255,0.3)",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translate(-50%, -50%) scale(1.2)",
              color: "rgba(255,255,255,0.7)",
              backgroundColor: "transparent",
            },
          }}
          onClick={() => {
            navigate(`/videos/${video._id}`);
          }}
        >
          <PlayCircleOutlineIcon
            fontSize="inherit"
            sx={{ color: "rgba(255,255,255,0.3)" }}
          />
        </IconButton>
      </Box>

      {/* Video info */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Typography variant="h6" noWrap fontWeight="bold">
            {video.title}
          </Typography>
          <Typography
            variant="caption"
            fontWeight={"bold"}
            noWrap
            sx={{
              color: mode ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)",
              overflow: "hidden", // hide overflow
              textOverflow: "ellipsis", // show "..." if text too long
            }}
          >
            {video.description}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          color="textSecondary"
          display="block"
          // mt={1}
        >
          {video.duration.toFixed(2)} min | {video.views} views |{" "}
          {video.isPublished ? "Published" : "Draft"} | Created{" "}
          {convertISOIntoLocalTime(video.createdAt || "").toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default IndividualVideoUI;
