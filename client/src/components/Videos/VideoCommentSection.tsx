import { Box, Typography, Stack, Divider } from "@mui/material";
import {} from "react";
import useMode from "../../hooks/useMode";
import useFetchCommentsOnVideo from "../../hooks/data-fetching/useFetchCommentsOnVideo";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import { useParams } from "react-router-dom";
import VideoCommentInput from "./VideoCommentInput";
import VideoCommentItem from "./VideoCommentItem";

const VideoCommentSection = () => {
  const { videoId } = useParams();
  const { mode } = useMode(); // true = light mode, false = dark mode
  const { data, isLoading } = useFetchCommentsOnVideo(videoId || "");
  const totalComments = data?.totalDocs;

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
      <VideoCommentInput videoId={videoId} theme={theme} onAdded={() => {}} />

      <Divider sx={{ bgcolor: theme.divider, mb: 3 }} />

      {/* Comments List */}
      {isLoading ? (
        <CircularProgressCenter size={40} />
      ) : data?.docs && data.docs.length > 0 ? (
        <Stack spacing={3}>
          {data.docs.map((comment) => (
            <VideoCommentItem
              key={comment._id}
              comment={comment}
              theme={theme}
            />
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
