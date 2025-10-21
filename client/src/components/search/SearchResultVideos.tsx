import React from "react";
import type { VideoSearchResult } from "../../hooks/searching/useSearchUserQuery";

const SearchResultVideos: React.FC<PropType> = ({ videos }) => {
  const renderMatchingVideos = videos.map((video) => {
    return <div key={video._id}></div>;
  });

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
