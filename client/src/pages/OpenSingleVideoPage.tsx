import { useEffect } from "react";
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
import VideoCommentSection from "../components/Videos/VideoCommentSection";
import useUpdateWatchHistory from "../hooks/data-fetching/useUpdateWatchHistory";
import { useQueryClient } from "@tanstack/react-query";

const OpenSingleVideoPage = () => {
  const queryClient = useQueryClient();
  const { videoId } = useParams();
  const { mode } = useMode();
  const { mutate: updateWatchHistory } = useUpdateWatchHistory();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log("useEffect calling");
    updateWatchHistory(videoId || "");
  }, [videoId]);

  queryClient.invalidateQueries({ queryKey: ["get-watch-history"] });

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
            <VideoPlayerMain data={data.video} />

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
                {data.video.title}
              </Typography>

              {/* Video Meta and Actions */}
              <VideoMetaDataAndAction
                data={data.video}
                theme={theme}
                isLikedByUser={data.isLikedByUser}
                likesCount={data.likesCount}
                username={data?.video.owner.username || ""}
              />

              {/* Channel and Description */}
              <VideoChannelAndDescription theme={theme} data={data.video} />
            </Box>
            <VideoCommentSection />
          </Box>
          <RelatedVideos />
        </Box>
      </Box>
    </Box>
  );
};

export default OpenSingleVideoPage;
