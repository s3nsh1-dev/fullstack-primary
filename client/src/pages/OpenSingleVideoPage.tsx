import { useParams } from "react-router-dom";
import {
  Box,
  Container,
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

const OpenSingleVideoPage = () => {
  const { videoId } = useParams();

  const { data, isLoading } = useFetchSingleVideo(
    videoId || "INVALID_Video-ID"
  );

  if (isLoading) return <CircularProgressCenter size={50} />;
  if (!data) return <ContentNotAvailable text="Video Not Available" />;

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
    <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", pb: 4 }}>
      <Container maxWidth="xl" sx={{ pt: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {/* Main Video Section */}
          <Box sx={{ flex: 1 }}>
            {/* Video Player */}
            <Paper
              elevation={0}
              sx={{
                bgcolor: "#000",
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
                  objectFit: "contain",
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
                  color: "#fff",
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
                <Stack direction="row" spacing={1} alignItems="center">
                  <Visibility sx={{ color: "#aaa", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "#aaa" }}>
                    {formatViews(data.views)} views
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#aaa" }}>
                    •
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#aaa" }}>
                    {formatDate(data.createdAt)}
                  </Typography>
                  <Chip
                    label={formatDuration(data.duration)}
                    size="small"
                    sx={{
                      bgcolor: "#272727",
                      color: "#fff",
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1}>
                  <Paper
                    sx={{
                      bgcolor: "#272727",
                      display: "flex",
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                    elevation={0}
                  >
                    <IconButton
                      sx={{
                        color: "#fff",
                        borderRadius: 0,
                        px: 2,
                        "&:hover": { bgcolor: "#3f3f3f" },
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
                      sx={{ bgcolor: "#3f3f3f" }}
                    />
                    <IconButton
                      sx={{
                        color: "#fff",
                        borderRadius: 0,
                        px: 2,
                        "&:hover": { bgcolor: "#3f3f3f" },
                      }}
                    >
                      <ThumbDownOutlined sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Paper>

                  <Button
                    startIcon={<ShareOutlined />}
                    sx={{
                      bgcolor: "#272727",
                      color: "#fff",
                      borderRadius: 5,
                      px: 2,
                      textTransform: "none",
                      "&:hover": { bgcolor: "#3f3f3f" },
                    }}
                  >
                    Share
                  </Button>

                  <IconButton
                    sx={{
                      bgcolor: "#272727",
                      color: "#fff",
                      "&:hover": { bgcolor: "#3f3f3f" },
                    }}
                  >
                    <MoreHoriz />
                  </IconButton>
                </Stack>
              </Stack>

              {/* Channel and Description */}
              <Paper
                sx={{
                  bgcolor: "#272727",
                  borderRadius: 2,
                  p: 2,
                }}
                elevation={0}
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
                      sx={{ color: "#fff", fontWeight: 600 }}
                    >
                      Channel Name
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#aaa" }}>
                      1.2M subscribers
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#fff",
                      color: "#0f0f0f",
                      borderRadius: 5,
                      textTransform: "none",
                      fontWeight: 600,
                      px: 3,
                      "&:hover": { bgcolor: "#d9d9d9" },
                    }}
                  >
                    Subscribe
                  </Button>
                </Stack>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
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
                      bgcolor: "#3f3f3f",
                      color: "#fff",
                      mt: 2,
                    }}
                  />
                )}
              </Paper>
            </Box>
          </Box>

          {/* Sidebar - Related Videos */}
          <Box sx={{ width: { xs: "100%", lg: 400 } }}>
            <Typography
              variant="h6"
              sx={{ color: "#fff", mb: 2, fontWeight: 600 }}
            >
              Related Videos
            </Typography>
            <Stack spacing={1}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Paper
                  key={item}
                  sx={{
                    display: "flex",
                    gap: 1,
                    bgcolor: "transparent",
                    cursor: "pointer",
                    p: 0,
                    "&:hover": {
                      bgcolor: "#272727",
                    },
                    borderRadius: 2,
                    transition: "background-color 0.2s",
                  }}
                  elevation={0}
                >
                  <Box
                    sx={{
                      width: 168,
                      height: 94,
                      bgcolor: "#272727",
                      borderRadius: 2,
                      flexShrink: 0,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={data.thumbnail}
                      alt="thumbnail"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Chip
                      label="4:12"
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        bgcolor: "rgba(0,0,0,0.8)",
                        color: "#fff",
                        fontSize: "0.75rem",
                        height: 20,
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, py: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#fff",
                        fontWeight: 500,
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.4,
                      }}
                    >
                      Related Video Title {item}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#aaa", display: "block" }}
                    >
                      Channel Name
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#aaa" }}>
                      1.2M views • 2 days ago
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default OpenSingleVideoPage;
