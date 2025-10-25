import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Chip,
} from "@mui/material";
import VideoLibrary from "@mui/icons-material/VideoLibrary";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Close from "@mui/icons-material/Close";
import CheckCircle from "@mui/icons-material/CheckCircle";

interface ThemeLike {
  bg: string;
  text: string;
  textSecondary: string;
  border: string;
  hoverBg: string;
  inputBg: string;
  primaryBg: string;
}

export interface VideoUploadStepProps {
  theme: ThemeLike;
  mode: boolean;
  videoPreview: string;
  videoFile: File | null;
  errorText?: string;
  onOpenFilePicker: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveVideo: () => void;
  videoInputRef: React.RefObject<HTMLInputElement | null>;
}

const VideoUploadStep: React.FC<VideoUploadStepProps> = ({
  theme,
  mode,
  videoPreview,
  videoFile,
  errorText,
  onOpenFilePicker,
  onFileChange,
  onRemoveVideo,
  videoInputRef,
}) => {
  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography
        variant="h5"
        sx={{ color: theme.text, fontWeight: 600, mb: 3 }}
      >
        Upload Your Video
      </Typography>

      {!videoPreview ? (
        <Box
          sx={{
            border: `2px dashed ${theme.border}`,
            borderRadius: 2,
            p: 6,
            bgcolor: theme.inputBg,
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: theme.primaryBg,
              bgcolor: theme.hoverBg,
            },
          }}
          onClick={onOpenFilePicker}
        >
          <VideoLibrary
            sx={{ fontSize: 80, color: theme.textSecondary, mb: 2 }}
          />
          <Typography variant="h6" sx={{ color: theme.text, mb: 1 }}>
            Select video to upload
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.textSecondary, mb: 3 }}
          >
            Or drag and drop a video file
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            sx={{
              bgcolor: theme.primaryBg,
              "&:hover": { bgcolor: mode ? "#0458b3" : "#2d9cff" },
              px: 4,
              py: 1.5,
            }}
          >
            Select File
          </Button>
          <Typography
            variant="caption"
            sx={{ color: theme.textSecondary, display: "block", mt: 3 }}
          >
            MP4, MOV, AVI • Max 500MB
          </Typography>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              position: "relative",
              bgcolor: "#000",
              borderRadius: 2,
              overflow: "hidden",
              mb: 2,
              maxHeight: 400,
            }}
          >
            <video
              src={videoPreview}
              controls
              style={{ width: "100%", maxHeight: 400, objectFit: "contain" }}
            />
            <IconButton
              onClick={onRemoveVideo}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              <Close />
            </IconButton>
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
          >
            <CheckCircle sx={{ color: "success.main", fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: theme.text }}>
              {videoFile?.name}
            </Typography>
            <Chip
              label={
                videoFile
                  ? `${(videoFile.size / (1024 * 1024)).toFixed(2)} MB`
                  : ""
              }
              size="small"
              sx={{ bgcolor: theme.hoverBg, color: theme.text }}
            />
          </Stack>
        </Box>
      )}
      {errorText && (
        <Typography
          variant="caption"
          sx={{ color: "error.main", mt: 2, display: "block" }}
        >
          {errorText}
        </Typography>
      )}
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        hidden
        onChange={onFileChange}
      />
    </Box>
  );
};

export default VideoUploadStep;
