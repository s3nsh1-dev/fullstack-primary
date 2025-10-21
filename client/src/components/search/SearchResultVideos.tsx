import React from "react";
import type { VideoSearchResult } from "../../hooks/searching/useSearchUserQuery";

const SearchResultVideos: React.FC<PropType> = () => {
  const renderMatchingVideos = <></>;

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
