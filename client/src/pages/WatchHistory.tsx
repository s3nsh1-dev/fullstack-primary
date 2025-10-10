import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import CircularProgressCenter from "../components/ui-components/CircularProgressCenter";
import useFetchWatchHistory from "../hooks/data-fetching/useFetchWatchHistory";

const WatchHistory: React.FC = () => {
  const { data, isLoading, isError } = useFetchWatchHistory();

  if (isError)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Error fetching watch history
      </Typography>
    );

  if (isLoading) return <CircularProgressCenter />;

  const videos = data?.watchHistory?.slice(0, 20) || [];

  if (videos.length === 0)
    return (
      <Typography color="textSecondary" textAlign="center" mt={4}>
        No watch history available
      </Typography>
    );

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Watch History
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {videos.map((video) => (
          <Box
            key={video._id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1,
              borderRadius: 2,
              boxShadow: 1,
              backgroundColor: "background.paper",
              transition: "transform 0.2s",
              overflow: "hidden",
              width: "90vw",
              "&:hover": { transform: "scale(0.95)" },
            }}
          >
            <Box
              component="img"
              src={video.thumbnail}
              alt={video.title}
              sx={{
                width: 120,
                height: 70,
                objectFit: "cover",
                borderRadius: 1,
                flexShrink: 0,
              }}
            />

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {video.title || "Untitled Video"}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
              >
                <Avatar
                  src={video.owner?.avatar}
                  alt={video.owner?.fullname}
                  sx={{ width: 24, height: 24 }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
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

              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {video.description || "No description"}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WatchHistory;
