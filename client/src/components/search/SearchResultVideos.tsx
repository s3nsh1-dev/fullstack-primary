import React from "react";
import type { VideoSearchResult } from "../../hooks/searching/useSearchUserQuery";
import { VideoSearchCard } from "./VideoSearchCard";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";

const SearchResultVideos: React.FC<PropType> = ({ videos }) => {
  const navigate = useNavigate();
  if (!videos || videos.length === 0) {
    return (
      <Typography
        color="textSecondary"
        sx={{ textAlign: "center", padding: "10px" }}
      >
        No Videos
      </Typography>
    );
  }

  const renderMatchingVideos = videos.map((video) => (
    <VideoSearchCard
      key={video._id}
      video={video}
      onClick={() => {
        console.log("navigating to video page", video.title);
        navigate(`/videos/${video?._id}`);
      }}
    />
  ));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {renderMatchingVideos}
    </div>
  );
};

export default SearchResultVideos;

type PropType = {
  videos: VideoSearchResult[];
};
