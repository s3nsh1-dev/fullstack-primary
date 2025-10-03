import React from "react";
import type { LikedItem } from "../../hooks/data-fetching/useFetchLikedContent";
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

const ShowMyLikesOnTweet: React.FC<{ item: LikedItem }> = ({ item }) => {
  const { user } = useAuth();
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
          imgSrc={item.tweet?.owner.avatar || "content-avatar"}
          fullname={item.tweet?.owner.fullname || "content-fullname"}
          username={item.tweet?.owner.username || "content-username"}
          createdAt={item.tweet?.updatedAt || "tweet-timestamp"}
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton>
              <ThumbUpIcon fontSize="small" color="primary" />
            </IconButton>
            <Typography sx={{ mr: 1 }} variant="caption" color="textSecondary">
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
          {item.tweet?.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ShowMyLikesOnTweet;

const style1 = { padding: "10px" };

const style5 = {
  p: 0, // shorthand for padding: 0
  "&:last-child": {
    pb: 0, // remove bottom padding
  },
};
const style6 = { mt: "5px" };
