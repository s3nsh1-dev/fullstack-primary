import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const ChangeProfileImage: React.FC<PropType> = ({
  onClose,
  currentImage,
  loading,
  submitRequest,
}) => {
  // const { mutate: changeAvatar } = useUpdateAvatar();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  interface ValidateAndSetFile {
    (file: File): void;
  }

  const validateAndSetFile: ValidateAndSetFile = (file: File): void => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, GIF)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError("");
    setSelectedFile(file);

    // Create preview URL
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      // FileReader.result can be string | ArrayBuffer | null, ensure we only set a string or null
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      } else {
        setPreviewUrl(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent parent click events
    setSelectedFile(null);
    setPreviewUrl(currentImage);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select an image to upload");
      return;
    }

    const imageForm = new FormData();
    imageForm.append("picture", selectedFile);

    submitRequest(imageForm);
  };
  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" component="div" fontWeight={500}>
          Change profile picture
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Preview Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={previewUrl ?? undefined}
                  sx={{
                    width: 160,
                    height: 160,
                    border: "4px solid",
                    borderColor: "divider",
                    boxShadow: 2,
                  }}
                />
                {selectedFile && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: "background.paper",
                      borderRadius: "50%",
                      boxShadow: 2,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleRemove}
                      sx={{
                        bgcolor: "error.main",
                        color: "white",
                        "&:hover": {
                          bgcolor: "error.dark",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Upload Area */}
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                border: "2px dashed",
                borderColor: isDragging ? "primary.main" : "divider",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                bgcolor: isDragging ? "action.hover" : "background.default",
                transition: "all 0.2s",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
              onClick={() => document.getElementById("picture-input")?.click()}
            >
              <CameraAltIcon
                sx={{
                  fontSize: 48,
                  color: "primary.main",
                  mb: 1,
                }}
              />
              <Typography variant="body1" fontWeight={500} gutterBottom>
                Drag and drop or click to upload
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedFile
                  ? selectedFile.name
                  : "JPG, PNG or GIF - Max size 5MB"}
              </Typography>
              <input
                type="file"
                id="picture-input"
                name="picture"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </Box>

            {/* Error Message */}
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Button
                color="error"
                onClick={onClose}
                variant="outlined"
                disabled={loading}
                sx={{
                  minWidth: 100,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={!selectedFile || loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <CloudUploadIcon />
                }
                sx={{
                  minWidth: 100,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeProfileImage;

type PropType = {
  onClose: () => void;
  currentImage: string;
  loading: boolean;
  submitRequest: (value: FormData) => void;
};
