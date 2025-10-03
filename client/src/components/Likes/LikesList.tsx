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
  Typography,
  CardContent,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import ContentProfileHeader from "../Tweets/ContentProfileHeader";
import useAuth from "../../hooks/useAuth";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const LikesList: React.FC<LikesListProps> = ({ data }) => {
  const { user } = useAuth();
  const renderAll = data.map((item) => {
    if (isLikeTweet(item)) {
      console.log("tweet", item.tweet);
      return (
        <Card key={item._id} sx={style1} elevation={4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <ContentProfileHeader
              style2={{}}
              imgSrc={item.tweet.owner.avatar}
              fullname={item.tweet.owner.fullname}
              username={item.tweet.owner.username}
              createdAt={item.tweet.updatedAt}
            />
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            <Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton>
                  <ThumbUpIcon fontSize="small" color="primary" />
                </IconButton>
                <Typography
                  sx={{ mr: 1 }}
                  variant="caption"
                  color="textSecondary"
                >
                  by
                </Typography>
                <Avatar
                  src={user?.user?.avatar}
                  alt="my-avatar"
                  sx={{ width: 25, height: 25 }}
                />
              </Box>
              <Typography variant="caption" color="textSecondary">
                {convertISOIntoLocalTime(item.updatedAt)}
              </Typography>
            </Box>
          </Box>
          <CardContent sx={style5}>
            <Typography variant="body1" color="textPrimary" sx={style6}>
              {item.tweet.content}
            </Typography>
          </CardContent>
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

const style5 = {
  p: 0, // shorthand for padding: 0
  "&:last-child": {
    pb: 0, // remove bottom padding
  },
};
const style6 = { mt: "5px" };
