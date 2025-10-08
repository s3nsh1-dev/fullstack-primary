import { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  LinearProgress,
  IconButton,
  Chip,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  CloudUpload,
  VideoLibrary,
  Image as ImageIcon,
  Close,
  CheckCircle,
} from "@mui/icons-material";
import useMode from "../../hooks/useMode";

interface VideoUploadFormProps {
  onSubmit?: (formData: VideoFormData) => void;
  onCancel?: () => void;
}

export interface VideoFormData {
  videoFile: File | null;
  thumbnail: File | null;
  title: string;
  description: string;
  visibility: "public" | "unlisted" | "private";
  tags: string[];
}

const VideoUploadForm = ({ onSubmit, onCancel }: VideoUploadFormProps) => {
  const { mode } = useMode(); // true = light, false = dark
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<VideoFormData>({
    videoFile: null,
    thumbnail: null,
    title: "",
    description: "",
    visibility: "public",
    tags: [],
  });

  const [videoPreview, setVideoPreview] = useState<string>("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const theme = {
    bg: mode ? "#fff" : "#282828",
    text: mode ? "#0f0f0f" : "#fff",
    textSecondary: mode ? "#606060" : "#aaa",
    border: mode ? "#e0e0e0" : "#3f3f3f",
    hoverBg: mode ? "#f2f2f2" : "#3f3f3f",
    inputBg: mode ? "#f9f9f9" : "#121212",
    primaryBg: mode ? "#065fd4" : "#3ea6ff",
    errorBg: mode ? "#fff4e5" : "#2d1f1f",
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setErrors({ ...errors, video: "Please select a valid video file" });
        return;
      }
      if (file.size > 500 * 1024 * 1024) {
        // 500MB limit
        setErrors({ ...errors, video: "Video file must be less than 500MB" });
        return;
      }

      setFormData({ ...formData, videoFile: file });
      setVideoPreview(URL.createObjectURL(file));
      setErrors({ ...errors, video: "" });

      // Auto-fill title from filename if empty
      if (!formData.title) {
        const titleFromFile = file.name.replace(/\.[^/.]+$/, "");
        setFormData((prev) => ({ ...prev, title: titleFromFile }));
      }
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, thumbnail: "Please select a valid image file" });
        return;
      }
      setFormData({ ...formData, thumbnail: file });
      setThumbnailPreview(URL.createObjectURL(file));
      setErrors({ ...errors, thumbnail: "" });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.videoFile) {
      newErrors.video = "Video file is required";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    if (formData.description.length > 5000) {
      newErrors.description = "Description must be less than 5000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsUploading(true);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Call parent submit handler
    if (onSubmit) {
      onSubmit(formData);
    }

    // Simulate completion
    setTimeout(() => {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(100);
    }, 3500);
  };

  const handleCancel = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    if (onCancel) onCancel();
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" sx={{ color: theme.text, fontWeight: 600 }}>
          Upload Video
        </Typography>
        <IconButton onClick={handleCancel} sx={{ color: theme.text }}>
          <Close />
        </IconButton>
      </Stack>

      {/* Upload Progress */}
      {isUploading && (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ color: theme.text }}>
              Uploading...
            </Typography>
            <Typography variant="body2" sx={{ color: theme.text }}>
              {uploadProgress}%
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {/* Success Message */}
      {uploadProgress === 100 && !isUploading && (
        <Alert icon={<CheckCircle />} severity="success" sx={{ mb: 3 }}>
          Video uploaded successfully!
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Video Upload Section */}
        <Paper
          sx={{
            p: 3,
            bgcolor: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: 2,
          }}
          elevation={0}
        >
          <Typography
            variant="subtitle1"
            sx={{ color: theme.text, fontWeight: 600, mb: 2 }}
          >
            Video File
          </Typography>

          {!videoPreview ? (
            <Box
              sx={{
                border: `2px dashed ${theme.border}`,
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                bgcolor: theme.inputBg,
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: theme.primaryBg,
                  bgcolor: theme.hoverBg,
                },
              }}
              onClick={() => videoInputRef.current?.click()}
            >
              <VideoLibrary
                sx={{ fontSize: 64, color: theme.textSecondary, mb: 2 }}
              />
              <Typography variant="h6" sx={{ color: theme.text, mb: 1 }}>
                Select video to upload
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.textSecondary, mb: 2 }}
              >
                Or drag and drop a video file
              </Typography>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                sx={{
                  bgcolor: theme.primaryBg,
                  "&:hover": { bgcolor: mode ? "#0458b3" : "#2d9cff" },
                }}
              >
                Select File
              </Button>
              <Typography
                variant="caption"
                sx={{ color: theme.textSecondary, display: "block", mt: 2 }}
              >
                MP4, MOV, AVI (Max 500MB)
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
                }}
              >
                <video
                  src={videoPreview}
                  controls
                  style={{
                    width: "100%",
                    maxHeight: 400,
                    objectFit: "contain",
                  }}
                />
                <IconButton
                  onClick={() => {
                    setFormData({ ...formData, videoFile: null });
                    setVideoPreview("");
                  }}
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
              <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                {formData.videoFile?.name} (
                {formData.videoFile
                  ? (formData.videoFile.size / (1024 * 1024)).toFixed(2)
                  : "0.00"}{" "}
                MB)
              </Typography>
            </Box>
          )}
          {errors.video && (
            <Typography variant="caption" sx={{ color: "error.main", mt: 1 }}>
              {errors.video}
            </Typography>
          )}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            hidden
            onChange={handleVideoSelect}
          />
        </Paper>

        {/* Video Details Section */}
        {formData.videoFile && (
          <>
            {/* Title */}
            <TextField
              fullWidth
              label="Title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              error={!!errors.title}
              helperText={
                errors.title || `${formData.title.length}/100 characters`
              }
              sx={{
                "& .MuiInputBase-input": { color: theme.text },
                "& .MuiInputLabel-root": { color: theme.textSecondary },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: theme.border },
                  "&:hover fieldset": { borderColor: theme.text },
                },
              }}
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              error={!!errors.description}
              helperText={
                errors.description ||
                `${formData.description.length}/5000 characters`
              }
              sx={{
                "& .MuiInputBase-input": { color: theme.text },
                "& .MuiInputLabel-root": { color: theme.textSecondary },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: theme.border },
                  "&:hover fieldset": { borderColor: theme.text },
                },
              }}
            />

            {/* Thumbnail Upload */}
            <Paper
              sx={{
                p: 3,
                bgcolor: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: 2,
              }}
              elevation={0}
            >
              <Typography
                variant="subtitle1"
                sx={{ color: theme.text, fontWeight: 600, mb: 2 }}
              >
                Thumbnail (Optional)
              </Typography>

              {!thumbnailPreview ? (
                <Box
                  sx={{
                    border: `2px dashed ${theme.border}`,
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    bgcolor: theme.inputBg,
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: theme.primaryBg,
                      bgcolor: theme.hoverBg,
                    },
                  }}
                  onClick={() => thumbnailInputRef.current?.click()}
                >
                  <ImageIcon
                    sx={{ fontSize: 48, color: theme.textSecondary, mb: 1 }}
                  />
                  <Typography variant="body2" sx={{ color: theme.text, mb: 1 }}>
                    Upload Thumbnail
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.textSecondary }}
                  >
                    JPG, PNG (Recommended: 1280x720)
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ position: "relative" }}>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    style={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      setFormData({ ...formData, thumbnail: null });
                      setThumbnailPreview("");
                    }}
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
              )}
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleThumbnailSelect}
              />
            </Paper>

            {/* Visibility */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: theme.textSecondary }}>
                Visibility
              </InputLabel>
              <Select
                value={formData.visibility}
                label="Visibility"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    visibility: e.target.value as
                      | "public"
                      | "unlisted"
                      | "private",
                  })
                }
                sx={{
                  color: theme.text,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.border,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.text,
                  },
                }}
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="unlisted">Unlisted</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </Select>
            </FormControl>

            {/* Tags */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.text, mb: 1, fontWeight: 600 }}
              >
                Tags
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  sx={{
                    flex: 1,
                    "& .MuiInputBase-input": { color: theme.text },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: theme.border },
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  sx={{
                    borderColor: theme.border,
                    color: theme.text,
                    "&:hover": { borderColor: theme.text },
                  }}
                >
                  Add
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{
                      bgcolor: theme.inputBg,
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Stack>

      {/* Action Buttons */}
      <Divider sx={{ my: 3, bgcolor: theme.border }} />
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          onClick={handleCancel}
          disabled={isUploading}
          sx={{
            color: theme.text,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": { bgcolor: theme.hoverBg },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!formData.videoFile || isUploading}
          variant="contained"
          sx={{
            bgcolor: theme.primaryBg,
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            "&:hover": { bgcolor: mode ? "#0458b3" : "#2d9cff" },
            "&:disabled": {
              bgcolor: mode ? "#e0e0e0" : "#3f3f3f",
              color: mode ? "#aaa" : "#606060",
            },
          }}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </Button>
      </Stack>
    </Box>
  );
};

export default VideoUploadForm;
