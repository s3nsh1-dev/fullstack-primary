import {
  Box,
  Typography,
  Avatar,
  Stack,
  TextField,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import {
  ThumbUpOutlined,
  ThumbDownOutlined,
  MoreVert,
} from "@mui/icons-material";
import { useState } from "react";
import useMode from "../../hooks/useMode";
import useFetchCommentsOnVideo from "../../hooks/data-fetching/useFetchCommentsOnVideo";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import useAddCommentOnVideo from "../../hooks/data-fetching/useAddCommentOnVideo";
import { useParams } from "react-router-dom";

const VideoCommentSection = () => {
  const { videoId } = useParams();
  const { mode } = useMode(); // true = light mode, false = dark mode
  const { mutate: addComment } = useAddCommentOnVideo();
  const { data, isLoading } = useFetchCommentsOnVideo(videoId || "");
  const totalComments = data?.totalDocs;
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  // Theme colors based on mode
  const theme = {
    bg: mode ? "#f9f9f9" : "#0f0f0f",
    text: mode ? "#0f0f0f" : "#fff",
    textSecondary: mode ? "#606060" : "#aaa",
    paperBg: mode ? "#fff" : "#272727",
    hoverBg: mode ? "#f2f2f2" : "#3f3f3f",
    divider: mode ? "#e0e0e0" : "#3f3f3f",
    inputBg: mode ? "#f9f9f9" : "#121212",
    inputBorder: mode ? "#e0e0e0" : "#3f3f3f",
    buttonBg: mode ? "#065fd4" : "#3ea6ff",
    buttonText: "#fff",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} week${
        Math.floor(diffDays / 7) > 1 ? "s" : ""
      } ago`;
    if (diffDays < 365)
      return `${Math.floor(diffDays / 30)} month${
        Math.floor(diffDays / 30) > 1 ? "s" : ""
      } ago`;
    return `${Math.floor(diffDays / 365)} year${
      Math.floor(diffDays / 365) > 1 ? "s" : ""
    } ago`;
  };

  const handleCommentSubmit = () => {
    console.log("Submitting comment:", commentText);
    if (commentText.trim() && commentText.length > 3) {
      // TODO: Implement comment submission API call
      setCommentText("");
      setShowCommentBox(false);
      addComment(
        {
          videoId: videoId || "INVALID_VIDEO-ID",
          content: commentText,
        },
        {
          onSuccess: () => {
            console.log("Comment submitted successfully");
            setCommentText("");
            setShowCommentBox(false);
          },
          onError: (error) => {
            console.error("Error submitting comment:", error);
          },
          onSettled: () => {},
        }
      );
    } else {
      alert("Comment must be at least 4 characters long");
    }
  };

  const handleCancel = () => {
    setCommentText("");
    setShowCommentBox(false);
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Comments Header */}
      <Typography
        variant="h6"
        sx={{
          color: theme.text,
          fontWeight: 600,
          mb: 3,
          fontSize: "1.25rem",
        }}
      >
        {totalComments || data?.docs?.length || 0} Comments
      </Typography>

      {/* Add Comment Box */}
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
            onBlur={() => setShowCommentBox(false)}
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
                  "&:hover": {
                    bgcolor: theme.hoverBg,
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCommentSubmit}
                disabled={!commentText.trim()}
                variant="contained"
                sx={{
                  bgcolor: theme.buttonBg,
                  color: theme.buttonText,
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 5,
                  px: 2,
                  "&:hover": {
                    bgcolor: mode ? "#0458b3" : "#2d9cff",
                  },
                  "&:disabled": {
                    bgcolor: mode ? "#e0e0e0" : "#3f3f3f",
                    color: mode ? "#aaa" : "#606060",
                  },
                }}
              >
                Comment
              </Button>
            </Stack>
          )}
        </Box>
      </Stack>

      <Divider sx={{ bgcolor: theme.divider, mb: 3 }} />

      {/* Comments List */}
      {isLoading ? (
        <CircularProgressCenter size={40} />
      ) : data?.docs && data.docs.length > 0 ? (
        <Stack spacing={3}>
          {data.docs.map((comment) => (
            <Stack key={comment._id} direction="row" spacing={2}>
              {/* Avatar */}
              <Avatar
                src={comment.owner.avatar}
                alt={comment.owner.fullname}
                sx={{
                  width: 40,
                  height: 40,
                }}
              />

              {/* Comment Content */}
              <Box sx={{ flex: 1 }}>
                {/* User Info and Date */}
                <Stack
                  direction="row"
                  spacing={1}
                  //   alignItems="center"
                  sx={{ mb: 0.5 }}
                >
                  <Stack>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.text,
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                    >
                      {comment.owner.fullname}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{comment.owner.username}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.textSecondary,
                      fontSize: "0.75rem",
                      paddingTop: "2.5px",
                    }}
                  >
                    ~{formatDate(comment.createdAt)}
                  </Typography>
                </Stack>

                {/* Comment Text */}
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.text,
                    lineHeight: 1.5,
                    mb: 1,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {comment.content}
                </Typography>

                {/* Comment Actions */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton
                    size="small"
                    sx={{
                      color: theme.text,
                      "&:hover": {
                        bgcolor: theme.hoverBg,
                      },
                    }}
                  >
                    <ThumbUpOutlined sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.textSecondary,
                      fontSize: "0.75rem",
                      minWidth: 20,
                    }}
                  >
                    0
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      color: theme.text,
                      "&:hover": {
                        bgcolor: theme.hoverBg,
                      },
                    }}
                  >
                    <ThumbDownOutlined sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Button
                    size="small"
                    sx={{
                      color: theme.text,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      minWidth: "auto",
                      px: 1,
                      "&:hover": {
                        bgcolor: theme.hoverBg,
                      },
                    }}
                  >
                    Reply
                  </Button>
                  <IconButton
                    size="small"
                    sx={{
                      color: theme.text,
                      ml: "auto !important",
                      "&:hover": {
                        bgcolor: theme.hoverBg,
                      },
                    }}
                  >
                    <MoreVert sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </Box>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography
            variant="body1"
            sx={{
              color: theme.textSecondary,
              mb: 1,
            }}
          >
            No comments yet
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.textSecondary,
            }}
          >
            Be the first to comment!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default VideoCommentSection;
