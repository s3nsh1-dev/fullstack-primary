import React from "react";
import VideoCard from "./VideoCard";
import TweetCard from "./TweetCard";
import type {
  VideoItem,
  TweetItem,
} from "../../hooks/data-fetching/useFetchFeed";

const FeedItem: React.FC<{ item: FeedItemProps }> = ({ item }) => {
  const renderItem = [];
  if (typeof item === "object" && "videoFile" in item) {
    renderItem.push(<VideoCard video={item} />);
  } else {
    renderItem.push(<TweetCard tweet={item} />);
  }
  return <div>{renderItem}</div>;
};

export default FeedItem;

// Type for any feed item (video or tweet)
type FeedItemProps = VideoItem | TweetItem;
