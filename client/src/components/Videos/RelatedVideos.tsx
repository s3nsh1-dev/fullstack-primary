import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import useMode from "../../hooks/useMode";

const RelatedVideos = () => {
  const { mode } = useMode(); // true = light mode, false = dark mode

  // Theme colors based on mode
  const theme = {
    text: mode ? "#0f0f0f" : "#fff",
    textSecondary: mode ? "#606060" : "#aaa",
    hoverBg: mode ? "#f2f2f2" : "#272727",
    chipBg: mode ? "#f2f2f2" : "#272727",
  };

  // Mock data - replace with actual API data
  const relatedVideos = [
    {
      id: 1,
      thumbnail:
        "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=2070&auto=format&fit=crop",
      duration: "4:12",
      title: "Amazing Video Content You'll Love",
      channelName: "Tech Channel",
      views: "1.2M",
      uploadedAt: "2 days ago",
    },
    {
      id: 2,
      thumbnail:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop",
      duration: "8:45",
      title: "Learn Something New Today",
      channelName: "Education Hub",
      views: "500K",
      uploadedAt: "1 week ago",
    },
    {
      id: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
      duration: "12:30",
      title: "Top 10 Tips for Beginners",
      channelName: "Pro Tips",
      views: "2.5M",
      uploadedAt: "3 days ago",
    },
    {
      id: 4,
      thumbnail:
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop",
      duration: "6:20",
      title: "Ultimate Guide to Success",
      channelName: "Motivation Daily",
      views: "890K",
      uploadedAt: "5 days ago",
    },
    {
      id: 5,
      thumbnail:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop",
      duration: "15:18",
      title: "Behind The Scenes Look",
      channelName: "Creative Studio",
      views: "3.1M",
      uploadedAt: "1 day ago",
    },
  ];

  return (
    <Box sx={{ width: { xs: "100%", lg: 400 } }}>
      <Typography
        variant="h6"
        sx={{ color: theme.text, mb: 2, fontWeight: 600 }}
      >
        Related Videos
      </Typography>
      <Stack spacing={1}>
        {relatedVideos.map((video) => (
          <Paper
            key={video.id}
            sx={{
              display: "flex",
              gap: 1,
              bgcolor: "transparent",
              cursor: "pointer",
              p: 0,
              "&:hover": {
                bgcolor: theme.hoverBg,
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
                bgcolor: theme.chipBg,
                borderRadius: 2,
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <Chip
                label={video.duration}
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
                  color: theme.text,
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
                {video.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.textSecondary, display: "block" }}
              >
                {video.channelName}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                {video.views} views • {video.uploadedAt}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default RelatedVideos;
