import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import useUpdateVideo from "../../hooks/data-fetching/useUpdateVideo";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";

const UpdateVideoModal: React.FC<PropType> = ({ open, onClose, video }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: updateVideo } = useUpdateVideo();

  const [videoForm, setVideoForm] = React.useState<FormState>(resetForm);
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(
    null
  );

  const handleUpdateVideo = () => {
    const formData: FormData = new FormData();
    if (!videoForm.title && !videoForm.description && !videoForm.thumbnail) {
      console.warn("Nothing to update");
      return;
    }
    formData.append("title", videoForm.title);
    formData.append("description", videoForm.description);
    if (videoForm.thumbnail) {
      formData.append("thumbnail", videoForm.thumbnail);
    }
    updateVideo(
      { videoId: video._id, updateContent: formData },
      {
        onSuccess: () => {
          const userId = user?.user?._id;
          if (userId)
            queryClient.invalidateQueries({
              queryKey: ["fetchVideos", userId],
            });
          queryClient.invalidateQueries({ queryKey: ["feed"] });
        },
        onSettled: () => {
          setVideoForm(resetForm);
          setThumbnailPreview(null);
          onClose();
        },
      }
    );
  };

  const handleVideoForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVideoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setVideoForm((prev) => ({ ...prev, thumbnail: file }));
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setVideoForm(resetForm);
    setThumbnailPreview(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
            width: { xs: "90%", sm: 500, md: 600 },
            maxHeight: "90vh",
            overflow: "auto",
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              bgcolor: "background.paper",
              borderBottom: 1,
              borderColor: "divider",
              p: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" component="h2" fontWeight={600}>
              Update Video Details
            </Typography>
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Stack spacing={3} sx={{ p: 3 }}>
            {/* Current Thumbnail Preview */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{ mb: 1.5 }}
              >
                Current Thumbnail
              </Typography>
              <Avatar
                src={thumbnailPreview || video.thumbnail}
                variant="rounded"
                sx={{
                  width: "100%",
                  height: 200,
                  bgcolor: "grey.100",
                }}
              >
                <ImageIcon sx={{ fontSize: 60, color: "grey.400" }} />
              </Avatar>
            </Box>

            {/* Title Field */}
            <TextField
              fullWidth
              label="Video Title"
              name="title"
              value={videoForm.title}
              onChange={handleVideoForm}
              placeholder={video.title}
              variant="outlined"
              helperText="Leave empty to keep current title"
            />

            {/* Description Field */}
            <TextField
              fullWidth
              label="Video Description"
              name="description"
              value={videoForm.description}
              onChange={handleVideoForm}
              placeholder={video.description}
              multiline
              rows={4}
              variant="outlined"
              helperText="Leave empty to keep current description"
            />

            {/* Thumbnail Upload */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{ mb: 1 }}
              >
                Update Thumbnail
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
                color="secondary"
                sx={{
                  py: 1.5,
                  borderStyle: "dashed",
                  borderWidth: 2,
                  "&:hover": {
                    borderStyle: "dashed",
                    borderWidth: 2,
                  },
                }}
              >
                Choose New Thumbnail
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {videoForm.thumbnail && (
                <Typography
                  variant="caption"
                  color="success.main"
                  sx={{ mt: 1, display: "block" }}
                >
                  ✓ {videoForm.thumbnail.name} selected
                </Typography>
              )}
            </Box>
          </Stack>

          {/* Footer Actions */}
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              bgcolor: "background.paper",
              borderTop: 1,
              borderColor: "divider",
              p: 2.5,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              color="inherit"
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateVideo}
              variant="contained"
              color="secondary"
              sx={{ minWidth: 100 }}
              disabled={
                !videoForm.title &&
                !videoForm.description &&
                !videoForm.thumbnail
              }
            >
              Update Video
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default UpdateVideoModal;

const resetForm: FormState = {
  title: "",
  description: "",
  thumbnail: null,
};

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

type FormState = {
  title: string;
  description: string;
  thumbnail: File | null;
};
