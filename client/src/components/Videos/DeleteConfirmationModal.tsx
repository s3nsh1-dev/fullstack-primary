import React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Paper,
  Fade,
  IconButton,
  Stack,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import useDeleteVideo from "../../hooks/data-fetching/useDeleteVideo";
import { useQueryClient } from "@tanstack/react-query";
import useMode from "../../hooks/useMode";

const DeleteConfirmationModal: React.FC<PropType> = ({
  onClose,
  open,
  video,
}) => {
  const { mode } = useMode();
  const isLight = mode === true;
  const queryClient = useQueryClient();
  const { mutate: deleteVideo, isPending } = useDeleteVideo();

  const handleDeleteVideo = () => {
    deleteVideo(video?._id, {
      onSuccess: () => {
        if (video?.owner)
          queryClient.invalidateQueries({
            queryKey: ["fetchVideos", video.owner],
          });
        queryClient.invalidateQueries({ queryKey: ["feed"] });
      },
      onSettled: () => {
        onClose();
      },
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Fade in={open}>
        <Paper
          elevation={24}
          sx={{
            position: "relative",
            width: { xs: "90%", sm: 500 },
            maxWidth: 600,
            borderRadius: 3,
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          {/* Header with danger color */}
          <Box
            sx={{
              bgcolor: "error.main",
              color: "error.contrastText",
              p: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <WarningAmberIcon sx={{ fontSize: 28 }} />
              <Typography variant="h6" component="h2" fontWeight={600}>
                Delete Video
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: "error.contrastText",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Stack spacing={3} sx={{ p: 3 }}>
            {/* Warning Alert */}
            <Alert
              severity="error"
              icon={<WarningAmberIcon />}
              sx={{
                bgcolor: isLight ? "error.50" : "rgba(211, 47, 47, 0.15)",
                "& .MuiAlert-icon": { color: "error.main" },
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                This action cannot be undone!
              </Typography>
            </Alert>

            {/* Video Details Card */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: isLight ? "grey.50" : "rgba(255, 255, 255, 0.05)",
                borderColor: isLight ? "grey.300" : "rgba(255, 255, 255, 0.12)",
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Thumbnail */}
                <Box
                  component="img"
                  src={video.thumbnail}
                  alt={video.title}
                  sx={{
                    width: 120,
                    height: 68,
                    borderRadius: 1,
                    objectFit: "cover",
                    bgcolor: isLight ? "grey.200" : "grey.800",
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                {/* Video Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      mb: 0.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {video.title}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      icon={<VideoLibraryIcon />}
                      label={`${video.views} views`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: isLight
                          ? "grey.300"
                          : "rgba(255, 255, 255, 0.23)",
                      }}
                    />
                    {video.isPublished ? (
                      <Chip
                        label="Published"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        label="Draft"
                        size="small"
                        color="default"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Warning Text */}
            <Box>
              <Typography variant="body1" color="text.primary" gutterBottom>
                Are you sure you want to delete this video?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This will permanently remove the video, including:
              </Typography>
              <Box
                component="ul"
                sx={{ mt: 1, pl: 2.5, color: "text.secondary" }}
              >
                <Typography component="li" variant="body2">
                  All video data and files
                </Typography>
                <Typography component="li" variant="body2">
                  View count and engagement metrics
                </Typography>
                <Typography component="li" variant="body2">
                  Comments and interactions
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Divider
            sx={{
              borderColor: isLight ? "grey.300" : "rgba(255, 255, 255, 0.12)",
            }}
          />

          {/* Footer Actions */}
          <Box
            sx={{
              p: 2.5,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              bgcolor: isLight ? "grey.50" : "rgba(255, 255, 255, 0.02)",
            }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              color="inherit"
              disabled={isPending}
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteVideo}
              variant="contained"
              color="error"
              startIcon={<DeleteForeverIcon />}
              disabled={isPending}
              sx={{
                minWidth: 140,
                fontWeight: 600,
              }}
            >
              {isPending ? "Deleting..." : "Delete Forever"}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default DeleteConfirmationModal;

type PropType = {
  onClose: () => void;
  open: boolean;
  video: {
    _id: string;
    videoFile: string;
    thumbnail: string;
    title: string;
    description: string;
    duration: number;
    createdAt: string;
    isPublished: boolean;
    views: number;
    owner: string;
  };
};
