import React from "react";
import type {
  LikedItem,
  Video,
  Comment,
  Tweet,
} from "../../hooks/data-fetching/useFetchLikedContent";
import { Card, CardActionArea } from "@mui/material";
import ContentProfileHeader from "../Tweets/ContentProfileHeader";

const LikesList: React.FC<LikesListProps> = ({ data }) => {
  const renderAll = data.map((item) => {
    if (isLikeTweet(item)) {
      console.log("tweet", item.tweet);
      return (
        <Card key={item._id}>
          <CardActionArea>
            <ContentProfileHeader
              style2={{}}
              imgSrc={item.tweet.owner.avatar}
              fullname={item.tweet.owner.fullname}
              username={item.tweet.owner.username}
              createdAt={item.tweet.updatedAt}
              content={item.tweet.content}
            />
          </CardActionArea>
        </Card>
      );
    }
    if (isLikeVideo(item)) {
      console.log("video", item.video);
      return <Card key={item._id}></Card>;
    }
    if (isLikeComment(item)) {
      console.log("comment", item.comment);
      return <Card key={item._id}></Card>;
    }
  });

  return <div>{renderAll}</div>;
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
