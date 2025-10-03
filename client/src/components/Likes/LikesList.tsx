import React from "react";
import type {
  LikedItem,
  Video,
  Comment,
  Tweet,
} from "../../hooks/data-fetching/useFetchLikedContent";
import ShowMyLikesOnTweet from "./ShowMyLikesOnTweet";
import { Box, Card } from "@mui/material";
import ShowMyLikesOnComment from "./ShowMyLikesOnComment";
// import { CardContent, Typography } from "@mui/material";
// import ContentProfileHeader from "../Tweets/ContentProfileHeader";
// import ShowLikeOwner from "./ShowLikeOwner";
// import CommentIcon from "@mui/icons-material/Comment";

const LikesList: React.FC<LikesListProps> = ({ data }) => {
  const renderAll = data.map((item) => {
    if (isLikeTweet(item)) {
      return <ShowMyLikesOnTweet key={item._id} item={item} />;
    }
    if (isLikeVideo(item)) {
      console.log("video", item.video);
      return <Card key={item._id} sx={style1} elevation={4}></Card>;
    }
    if (isLikeComment(item)) {
      // console.log("comment", item.comment);
      const link = item.comment.tweet ?? item.comment.video;
      return <ShowMyLikesOnComment key={item._id} item={item} link={link} />;
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

const style1 = { padding: "10px" };

// const style5 = {
//   p: 0, // shorthand for padding: 0
//   "&:last-child": {
//     pb: 0, // remove bottom padding
//   },
//   display: "flex",
//   alignItems: "center",
// };
// const style6 = { mt: "5px", overflow: "hidden", textOverflow: "ellipsis" };
