import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Close, ArrowBack, ArrowForward } from "@mui/icons-material";
import VideoUploadStep from "./VideoUploadStep";
import DetailsStep from "./DetailsStep";
import DescriptionStep from "./DescriptionStep";
import useMode from "../../hooks/useMode";

const VideoUploadForm = ({
  onSubmit,
  onCancel,
  theme,
}: VideoUploadFormProps) => {
  const { mode } = useMode();
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<VideoFormData>(resetForm);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setErrors({ ...errors, video: "Please select a valid video file" });
        return;
      }
      if (file.size > 500 * 1024 * 1024) {
        setErrors({ ...errors, video: "Video file must be less than 500MB" });
        return;
      }

      setFormData({ ...formData, videoFile: file });
      setVideoPreview(URL.createObjectURL(file));
      setErrors({ ...errors, video: "" });

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

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.videoFile) {
        newErrors.video = "Video file is required";
      }
    } else if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      } else if (formData.title.length > 100) {
        newErrors.title = "Title must be less than 100 characters";
      }
    } else if (step === 2) {
      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      } else if (formData.description.length > 5000) {
        newErrors.description = "Description must be less than 5000 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setIsUploading(true);

    if (onSubmit) {
      onSubmit(formData);
    }

    setTimeout(() => {
      setIsUploading(false);
    }, 3500);
  };

  const handleCancel = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    if (onCancel) onCancel();
  };

  // Steps moved into separate presentational components to keep logic intact

  return (
    <Box sx={sxValue1}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" sx={{ color: theme.text, fontWeight: 600 }}>
          Upload Video
        </Typography>
        <IconButton onClick={handleCancel} sx={{ color: theme.text }}>
          <Close />
        </IconButton>
      </Stack>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": { color: theme.textSecondary },
                "& .MuiStepLabel-label.Mui-active": { color: theme.text },
                "& .MuiStepLabel-label.Mui-completed": { color: theme.text },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Content Area */}
      <Box sx={{ flex: 1, overflow: "auto", mb: 2 }}>
        {activeStep === 0 && (
          <VideoUploadStep
            theme={theme}
            mode={!!mode}
            videoPreview={videoPreview}
            videoFile={formData.videoFile}
            errorText={errors.video}
            onOpenFilePicker={() => videoInputRef.current?.click()}
            onFileChange={handleVideoSelect}
            onRemoveVideo={() => {
              setFormData({ ...formData, videoFile: null });
              setVideoPreview("");
            }}
            videoInputRef={videoInputRef}
          />
        )}
        {activeStep === 1 && (
          <DetailsStep
            theme={theme}
            title={formData.title}
            titleError={errors.title}
            onTitleChange={(value) =>
              setFormData({ ...formData, title: value })
            }
            titleLength={formData.title.length}
            thumbnailPreview={thumbnailPreview}
            onOpenThumbPicker={() => thumbnailInputRef.current?.click()}
            onThumbChange={handleThumbnailSelect}
            onRemoveThumb={() => {
              setFormData({ ...formData, thumbnail: null });
              setThumbnailPreview("");
            }}
            thumbnailInputRef={thumbnailInputRef}
            mode={!!mode}
          />
        )}
        {activeStep === 2 && (
          <DescriptionStep
            theme={theme}
            description={formData.description}
            descriptionError={errors.description}
            onDescriptionChange={(value) =>
              setFormData({ ...formData, description: value })
            }
            descriptionLength={formData.description.length}
          />
        )}
      </Box>

      {/* Navigation Buttons */}
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          onClick={activeStep === 0 ? handleCancel : handleBack}
          disabled={isUploading}
          startIcon={activeStep !== 0 ? <ArrowBack /> : null}
          sx={{
            color: theme.text,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": { bgcolor: theme.hoverBg },
          }}
        >
          {activeStep === 0 ? "Cancel" : "Back"}
        </Button>
        <Button
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          disabled={isUploading || (activeStep === 0 && !formData.videoFile)}
          variant="contained"
          endIcon={activeStep !== steps.length - 1 ? <ArrowForward /> : null}
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
          {isUploading
            ? "Uploading..."
            : activeStep === steps.length - 1
            ? "Upload Video"
            : "Next"}
        </Button>
      </Stack>
    </Box>
  );
};

export default VideoUploadForm;

const steps = ["Upload Video", "Details & Thumbnail", "Description"];

interface VideoUploadFormProps {
  onSubmit?: (formData: VideoFormData) => void;
  onCancel?: () => void;
  theme: ThemeType;
}

type ThemeType = {
  bg: string;
  text: string;
  textSecondary: string;
  border: string;
  hoverBg: string;
  inputBg: string;
  primaryBg: string;
};

export interface VideoFormData {
  videoFile: File | null;
  thumbnail: File | null;
  title: string;
  description: string;
  // visibility and tags removed — backend does not use them
}

const sxValue1 = {
  width: "100%",
  maxWidth: 700,
  p: 1,
  height: "80vh",
  display: "flex",
  flexDirection: "column",
};

const resetForm = {
  videoFile: null,
  thumbnail: null,
  title: "",
  description: "",
};
