import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useAddCommentOnVideo from "../../hooks/data-fetching/useAddCommentOnVideo";
import { useQueryClient } from "@tanstack/react-query";

type ThemeType = {
  text: string;
  inputBorder: string;
  buttonBg: string;
  buttonText: string;
  hoverBg: string;
};

interface Props {
  videoId?: string | null;
  theme: ThemeType;
  minLength?: number;
  onAdded?: () => void;
}

const VideoCommentInput: React.FC<Props> = ({
  videoId,
  theme,
  minLength = 4,
  onAdded,
}) => {
  const queryClient = useQueryClient();
  const addCommentMutation = useAddCommentOnVideo();
  const addComment = addCommentMutation.mutate;
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleSubmit = () => {
    if (!commentText.trim() || commentText.trim().length < minLength) {
      alert(`Comment must be at least ${minLength} characters long`);
      return;
    }
    addComment(
      { videoId: videoId || "INVALID_VIDEO-ID", content: commentText },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["videoComments", videoId],
          });
          onAdded?.();
        },
        onError: (err) => {
          console.error("Error submitting comment:", err);
        },
        onSettled: () => {
          setCommentText("");
          setShowCommentBox(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setCommentText("");
    setShowCommentBox(false);
  };

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: "#3ea6ff",
        }}
      >
        U
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <TextField
          fullWidth
          placeholder="Add a comment..."
          variant="standard"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onFocus={() => setShowCommentBox(true)}
          sx={{
            "& .MuiInputBase-input": {
              color: theme.text,
              fontSize: "0.95rem",
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: theme.inputBorder,
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: theme.text,
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: theme.buttonBg,
            },
          }}
        />

        {showCommentBox && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2 }}
            justifyContent="flex-end"
          >
            <Button
              onClick={handleCancel}
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
              disabled={!commentText.trim()}
              variant="contained"
              sx={{
                bgcolor: theme.buttonBg,
                color: theme.buttonText,
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 5,
                px: 2,
                "&:hover": { bgcolor: "#0458b3" },
                "&:disabled": {
                  bgcolor: "#e0e0e0",
                  color: "#aaa",
                },
              }}
            >
              Comment
            </Button>
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default VideoCommentInput;
