import React from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import { Image as ImageIcon, Close } from "@mui/icons-material";

interface ThemeLike {
  bg: string;
  text: string;
  textSecondary: string;
  border: string;
  hoverBg: string;
  inputBg: string;
  primaryBg: string;
}

export interface DetailsStepProps {
  theme: ThemeLike;
  title: string;
  titleError?: string;
  onTitleChange: (value: string) => void;
  titleLength: number;
  thumbnailPreview: string;
  onOpenThumbPicker: () => void;
  onThumbChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveThumb: () => void;
  thumbnailInputRef: React.RefObject<HTMLInputElement | null>;
  mode: boolean;
}

const DetailsStep: React.FC<DetailsStepProps> = ({
  theme,
  title,
  titleError,
  onTitleChange,
  titleLength,
  thumbnailPreview,
  onOpenThumbPicker,
  onThumbChange,
  onRemoveThumb,
  thumbnailInputRef,
}) => {
  return (
    <Box sx={{ py: 3 }}>
      <Typography
        variant="h5"
        sx={{ color: theme.text, fontWeight: 600, mb: 3 }}
      >
        Video Details
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          fullWidth
          label="Title"
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          error={!!titleError}
          helperText={titleError || `${titleLength}/100 characters`}
          sx={{
            "& .MuiInputBase-input": { color: theme.text },
            "& .MuiInputLabel-root": { color: theme.textSecondary },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: theme.border },
              "&:hover fieldset": { borderColor: theme.text },
            },
          }}
        />

        <Box>
          <Typography
            variant="subtitle1"
            sx={{ color: theme.text, fontWeight: 600, mb: 2 }}
          >
            Thumbnail
          </Typography>

          {!thumbnailPreview ? (
            <Box
              sx={{
                border: `2px dashed ${theme.border}`,
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                bgcolor: theme.inputBg,
                cursor: "pointer",
                "&:hover": {
                  borderColor: theme.primaryBg,
                  bgcolor: theme.hoverBg,
                },
              }}
              onClick={onOpenThumbPicker}
            >
              <ImageIcon
                sx={{ fontSize: 48, color: theme.textSecondary, mb: 1 }}
              />
              <Typography variant="body2" sx={{ color: theme.text, mb: 1 }}>
                Upload Thumbnail
              </Typography>
              <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                JPG, PNG • Recommended: 1280x720
              </Typography>
            </Box>
          ) : (
            <Box sx={{ position: "relative" }}>
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <IconButton
                onClick={onRemoveThumb}
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
            onChange={onThumbChange}
          />
        </Box>

        {/* visibility removed because backend does not use it */}
      </Box>
    </Box>
  );
};

export default DetailsStep;
