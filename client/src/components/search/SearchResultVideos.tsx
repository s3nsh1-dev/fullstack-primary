import React from "react";
import type { VideoSearchResult } from "../../hooks/searching/useSearchUserQuery";
import { VideoSearchCard } from "./VideoSearchCard";

const SearchResultVideos: React.FC<PropType> = ({ videos }) => {
  const renderMatchingVideos = videos.map((video) => (
    <VideoSearchCard
      key={video._id}
      video={video}
      onClick={() => {
        // Handle video click - navigate to video page
        console.log("Video clicked:", video._id);
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
