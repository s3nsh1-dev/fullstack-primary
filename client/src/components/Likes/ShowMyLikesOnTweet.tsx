import React from "react";
import type { LikedItem } from "../../hooks/data-fetching/useFetchLikedContent";
import { Box, Card, Typography, CardContent, Divider } from "@mui/material";
import ContentProfileHeader from "../Tweets/ContentProfileHeader";
import ShowLikeOwner from "./ShowLikeOwner";

const ShowMyLikesOnTweet: React.FC<{ item: LikedItem }> = ({ item }) => {
  return (
    <Card sx={style1} elevation={4}>
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
        <ShowLikeOwner timestamp={item.updatedAt} />
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
