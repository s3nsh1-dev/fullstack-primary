import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  IconButton,
  Divider,
  Avatar,
  Button,
} from "@mui/material";
import {
  ThumbUpOutlined,
  ThumbDownOutlined,
  ShareOutlined,
  MoreHoriz,
  Visibility,
} from "@mui/icons-material";
import CircularProgressCenter from "../components/ui-components/CircularProgressCenter";
import ContentNotAvailable from "../components/others/ContentNotAvailable";
import useFetchSingleVideo from "../hooks/data-fetching/useFetchSingleVideo";
import useMode from "../hooks/useMode";
import RelatedVideos from "../components/Videos/RelatedVideos";

const OpenSingleVideoPage = () => {
  const { videoId } = useParams();
  const { mode } = useMode(); // true = light mode, false = dark mode

  const { data, isLoading } = useFetchSingleVideo(
    videoId || "INVALID_Video-ID"
  );

  if (isLoading) return <CircularProgressCenter size={50} />;
  if (!data) return <ContentNotAvailable text="Video Not Available" />;

  // Theme colors based on mode
  const theme = {
    bg: mode ? "#f9f9f9" : "#0f0f0f",
    text: mode ? "#0f0f0f" : "#fff",
    textSecondary: mode ? "#606060" : "#aaa",
    paperBg: mode ? "#fff" : "#272727",
    hoverBg: mode ? "#f2f2f2" : "#3f3f3f",
    divider: mode ? "#e0e0e0" : "#3f3f3f",
    chipBg: mode ? "#f2f2f2" : "#272727",
    buttonBg: mode ? "#065fd4" : "#272727",
    buttonText: mode ? "#fff" : "#fff",
    subscribeBg: mode ? "#cc0000" : "#fff",
    subscribeText: mode ? "#fff" : "#0f0f0f",
    subscribeBgHover: mode ? "#a00000" : "#d9d9d9",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Box
      sx={{
        // minHeight: "100vh",
        p: "1%",
      }}
    >
      <Box sx={{ pt: 0 }}>
        <Box
          sx={{
            display: "flex",
            gap: 8,
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {/* Main Video Section */}
          <Box sx={{ flex: 1 }}>
            {/* Video Player */}
            <Paper
              elevation={mode ? 1 : 0}
              sx={{
                bgcolor: "black",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                paddingTop: "56.25%", // 16:9 aspect ratio
              }}
            >
              <video
                controls
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                poster={data.thumbnail}
                src={data.videoFile}
              >
                Your browser does not support the video tag.
              </video>
            </Paper>

            {/* Video Info Section */}
            <Box sx={{ mt: 2 }}>
              {/* Title */}
              <Typography
                variant="h5"
                sx={{
                  color: theme.text,
                  fontWeight: 600,
                  mb: 1,
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                }}
              >
                {data.title}
              </Typography>

              {/* Video Meta and Actions */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{ mb: 2 }}
              >
                {/* Views and Date */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Visibility
                    sx={{ color: theme.textSecondary, fontSize: 20 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: theme.textSecondary }}
                  >
                    {formatViews(data.views)} views
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.textSecondary }}
                  >
                    •
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.textSecondary }}
                  >
                    {formatDate(data.createdAt)}
                  </Typography>
                  <Chip
                    label={formatDuration(data.duration)}
                    size="small"
                    sx={{
                      bgcolor: theme.chipBg,
                      color: theme.text,
                      fontSize: "0.75rem",
                      height: 24,
                      border: mode ? "1px solid #e0e0e0" : "none",
                    }}
                  />
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Paper
                    sx={{
                      bgcolor: theme.paperBg,
                      display: "flex",
                      borderRadius: 5,
                      overflow: "hidden",
                      border: mode ? "1px solid #e0e0e0" : "none",
                    }}
                    elevation={mode ? 0 : 0}
                  >
                    <IconButton
                      sx={{
                        color: theme.text,
                        borderRadius: 0,
                        px: 2,
                        "&:hover": { bgcolor: theme.hoverBg },
                      }}
                    >
                      <ThumbUpOutlined sx={{ fontSize: 20 }} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        Like
                      </Typography>
                    </IconButton>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ bgcolor: theme.divider }}
                    />
                    <IconButton
                      sx={{
                        color: theme.text,
                        borderRadius: 0,
                        px: 2,
                        "&:hover": { bgcolor: theme.hoverBg },
                      }}
                    >
                      <ThumbDownOutlined sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Paper>

                  <Button
                    startIcon={<ShareOutlined />}
                    sx={{
                      bgcolor: theme.paperBg,
                      color: theme.text,
                      borderRadius: 5,
                      px: 2,
                      textTransform: "none",
                      border: mode ? "1px solid #e0e0e0" : "none",
                      "&:hover": { bgcolor: theme.hoverBg },
                    }}
                  >
                    Share
                  </Button>

                  <IconButton
                    sx={{
                      bgcolor: theme.paperBg,
                      color: theme.text,
                      border: mode ? "1px solid #e0e0e0" : "none",
                      "&:hover": { bgcolor: theme.hoverBg },
                    }}
                  >
                    <MoreHoriz />
                  </IconButton>
                </Stack>
              </Stack>

              {/* Channel and Description */}
              <Paper
                sx={{
                  bgcolor: theme.paperBg,
                  borderRadius: 2,
                  p: 2,
                  border: mode ? "1px solid #e0e0e0" : "none",
                }}
                elevation={mode ? 0 : 0}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="flex-start"
                  sx={{ mb: 2 }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "#3ea6ff",
                    }}
                  >
                    {data.title.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: theme.text, fontWeight: 600 }}
                    >
                      Channel Name
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.textSecondary }}
                    >
                      1.2M subscribers
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: theme.subscribeBg,
                      color: theme.subscribeText,
                      borderRadius: 5,
                      textTransform: "none",
                      fontWeight: 600,
                      px: 3,
                      "&:hover": { bgcolor: theme.subscribeBgHover },
                    }}
                  >
                    Subscribe
                  </Button>
                </Stack>

                <Typography
                  variant="body2"
                  sx={{
                    color: theme.text,
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  {data.description}
                </Typography>

                {!data.isPublished && (
                  <Chip
                    label="Unlisted"
                    size="small"
                    sx={{
                      bgcolor: theme.hoverBg,
                      color: theme.text,
                      mt: 2,
                      border: mode ? "1px solid #e0e0e0" : "none",
                    }}
                  />
                )}
              </Paper>
            </Box>
          </Box>
          <RelatedVideos />
        </Box>
      </Box>
    </Box>
  );
};

export default OpenSingleVideoPage;
