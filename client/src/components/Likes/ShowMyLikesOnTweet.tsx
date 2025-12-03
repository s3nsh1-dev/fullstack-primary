import React from "react";
import type { ILikedContent } from "../../hooks/data-fetching/useFetchLikedContent";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import ContentProfileHeader from "../Tweets/ContentProfileHeader";
import ShowLikeOwner from "./ShowLikeOwner";
import TwitterIcon from "@mui/icons-material/Twitter";

const ShowMyLikesOnTweet: React.FC<{ item: ILikedContent }> = ({ item }) => {
  return (
    <Card sx={style1} elevation={4}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ContentProfileHeader
          style2={{}}
          imgSrc={item.tweet?.owner.avatar || "content-avatar"}
          fullname={item.tweet?.owner.fullname || "content-fullname"}
          username={item.tweet?.owner.username || "content-username"}
          createdAt={item.tweet?.updatedAt || "tweet-timestamp"}
        />
        <ShowLikeOwner timestamp={item.updatedAt} />
      </Box>
      <CardContent sx={style5}>
        <TwitterIcon fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="body1" color="textPrimary" sx={style6}>
          {item.tweet?.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ShowMyLikesOnTweet;

const style1 = { padding: "10px", backgroundColor: "#7685bfff" };

const style5 = {
  p: 0, // shorthand for padding: 0
  "&:last-child": {
    pb: 0, // remove bottom padding
  },
  display: "flex",
  alignItems: "center",
};
const style6 = { mt: "5px", overflow: "hidden", textOverflow: "ellipsis" };
