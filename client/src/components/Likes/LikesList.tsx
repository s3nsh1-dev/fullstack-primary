import React from "react";
import type {
  LikedItem,
  Video,
  Comment,
  Tweet,
} from "../../hooks/data-fetching/useFetchLikedContent";
import ShowMyLikesOnTweet from "./ShowMyLikesOnTweet";
import { Box } from "@mui/material";
import ShowMyLikesOnComment from "./ShowMyLikesOnComment";
import ShowMyLikesOnVideo from "./ShowMyLikesOnVideo";

const LikesList: React.FC<LikesListProps> = ({ data }) => {
  const renderAll = data.map((item) => {
    const link = item.comment?.tweet ?? item.comment?.video;
    if (isLikeTweet(item))
      return <ShowMyLikesOnTweet key={item._id} item={item} />;
    if (isLikeVideo(item))
      return <ShowMyLikesOnVideo key={item._id} item={item} link={link} />;
    if (isLikeComment(item))
      return <ShowMyLikesOnComment key={item._id} item={item} link={link} />;
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, m: 1 }}>
      {renderAll}
    </Box>
  );
};

export default LikesList;

type LikesListProps = {
  data: LikedItem[];
};

const isLikeTweet = (item: LikedItem): item is LikedItem & { tweet: Tweet } => {
  return item.tweet !== undefined;
};

const isLikeVideo = (item: LikedItem): item is LikedItem & { video: Video } => {
  return item.video !== undefined;
};

const isLikeComment = (
  item: LikedItem
): item is LikedItem & { comment: Comment } => {
  return item.comment !== undefined;
};
