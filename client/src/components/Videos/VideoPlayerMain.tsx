import React, { useRef } from "react";
import useMode from "../../hooks/useMode";
import Paper from "@mui/material/Paper";
import { useVideoViewTracker } from "../../hooks/data-fetching/useVideoViewTracker";
import type { SingleVideoType } from "../../hooks/data-fetching/useFetchSingleVideo";

const VideoPlayerMain: React.FC<VideoPlayerMainType> = ({ data }) => {
  const { mode } = useMode();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Automatically track video views
  useVideoViewTracker({
    videoId: data._id,
    videoRef,
    enabled: true,
  });

  return (
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
        ref={videoRef}
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
  );
};

export default VideoPlayerMain;

export type VideoPlayerMainType = {
  data: SingleVideoType;
};
