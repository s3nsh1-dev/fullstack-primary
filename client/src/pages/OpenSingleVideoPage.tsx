import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import CircularProgressCenter from "../components/ui-components/CircularProgressCenter";
import ContentNotAvailable from "../components/others/ContentNotAvailable";
import useFetchSingleVideo from "../hooks/data-fetching/useFetchSingleVideo";
import useMode from "../hooks/useMode";
import RelatedVideos from "../components/Videos/RelatedVideos";
import VideoPlayerMain from "../components/Videos/VideoPlayerMain";
import VideoMetaDataAndAction from "../components/Videos/VideoMetaDataAndAction";
import VideoChannelAndDescription from "../components/Videos/VideoChannelAndDescription";

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
    <Box p="1%">
      <Box pt={0}>
        <Box
          sx={{
            display: "flex",
            gap: 8,
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {/* Main Video Section */}
          <Box flex={1}>
            {/* Video Player */}
            <VideoPlayerMain data={data} />

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
              <VideoMetaDataAndAction
                data={data}
                theme={theme}
                formatDate={formatDate}
                formatViews={formatViews}
                formatDuration={formatDuration}
              />

              {/* Channel and Description */}
              <VideoChannelAndDescription theme={theme} data={data} />
            </Box>
          </Box>
          <RelatedVideos />
        </Box>
      </Box>
    </Box>
  );
};

export default OpenSingleVideoPage;
