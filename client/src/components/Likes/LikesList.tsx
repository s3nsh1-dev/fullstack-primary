import React from "react";
import type {
  LikedItem,
  Video,
  Comment,
  Tweet,
} from "../../hooks/data-fetching/useFetchLikedContent";
import {
  Box,
  Card,
  CardActionArea,
  Typography,
  CardContent,
  Stack,
} from "@mui/material";
import ContentProfileHeader from "../Tweets/ContentProfileHeader";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";

const LikesList: React.FC<LikesListProps> = ({ data }) => {
  const renderAll = data.map((item) => {
    if (isLikeTweet(item)) {
      console.log("tweet", item.tweet);
      return (
        <Card key={item._id}>
          <CardActionArea sx={style1}>
            <Stack direction="column" spacing={1} alignItems="start">
              <ContentProfileHeader
                style2={{}}
                imgSrc={item.tweet.owner.avatar}
                fullname={item.tweet.owner.fullname}
                username={item.tweet.owner.username}
                createdAt={item.tweet.updatedAt}
              />
              <CardContent sx={style5}>
                <Typography variant="body1" color="textPrimary" sx={style6}>
                  {item.tweet.content}
                </Typography>
              </CardContent>
            </Stack>
            <Box>
              <Typography> LikedBy --- me</Typography>
              <Typography>{convertISOIntoLocalTime(item.updatedAt)}</Typography>
            </Box>
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, m: 1 }}>
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

const style5 = {
  p: 0, // shorthand for padding: 0
  "&:last-child": {
    pb: 0, // remove bottom padding
  },
};
const style6 = { mt: "5px" };
