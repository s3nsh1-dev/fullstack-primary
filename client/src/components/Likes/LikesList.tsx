import React from "react";
import type {
  LikedItem,
  Video,
  Comment,
  Tweet,
} from "../../hooks/data-fetching/useFetchLikedContent";
import { Box, Card } from "@mui/material";
import ShowMyLikesOnTweet from "./ShowMyLikesOnTweet";

const LikesList: React.FC<LikesListProps> = ({ data }) => {
  const renderAll = data.map((item) => {
    if (isLikeTweet(item)) {
      // console.log("tweet", item.tweet);
      return <ShowMyLikesOnTweet key={item._id} item={item} />;
    }
    if (isLikeVideo(item)) {
      // console.log("video", item.video);
      return <Card key={item._id}></Card>;
    }
    if (isLikeComment(item)) {
      // console.log("comment", item.comment);
      return <Card key={item._id}></Card>;
    }
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
