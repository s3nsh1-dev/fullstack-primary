import React from "react";
import type {
  ILikedContent,
  IVideo,
  IComment,
  ITweet,
} from "../../hooks/data-fetching/useFetchLikedContent";
import ShowMyLikesOnTweet from "./ShowMyLikesOnTweet";
import Box from "@mui/material/Box";
import ShowMyLikesOnComment from "./ShowMyLikesOnComment";
import ShowMyLikesOnVideo from "./ShowMyLikesOnVideo";

const LikesList: React.FC<LikesListProps> = ({ data }) => {
  const renderAll = data.map((item) => {
    const link: SharableLinkType = undefined;
    if (isLikeTweet(item))
      return <ShowMyLikesOnTweet key={item._id} item={item} />;
    if (isLikeVideo(item))
      return <ShowMyLikesOnVideo key={item._id} item={item} />;
    if (isLikeComment(item))
      return <ShowMyLikesOnComment key={item._id} item={item} link={link} />;
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {renderAll}
    </Box>
  );
};

export default LikesList;

type LikesListProps = {
  data: ILikedContent[];
};

const isLikeTweet = (
  item: ILikedContent
): item is ILikedContent & { tweet: ITweet } => {
  return item.tweet !== undefined;
};

const isLikeVideo = (
  item: ILikedContent
): item is ILikedContent & { video: IVideo } => {
  return item.video !== undefined;
};

const isLikeComment = (
  item: ILikedContent
): item is ILikedContent & { comment: IComment } => {
  return item.comment !== undefined;
};

type SharableLinkType = { title: string; url: string } | undefined;
