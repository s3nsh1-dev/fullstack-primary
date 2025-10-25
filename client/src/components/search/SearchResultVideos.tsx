import React from "react";
import type { VideoSearchResult } from "../../hooks/searching/useSearchUserQuery";
import { VideoSearchCard } from "./VideoSearchCard";
import { useNavigate } from "react-router-dom";

const SearchResultVideos: React.FC<PropType> = ({ videos }) => {
  const navigate = useNavigate();
  const renderMatchingVideos = videos.map((video) => (
    <VideoSearchCard
      key={video._id}
      video={video}
      onClick={() => {
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
