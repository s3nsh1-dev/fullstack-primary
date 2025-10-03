import React from "react";
import type { LikedItem } from "../../hooks/data-fetching/useFetchLikedContent";
import { Box, Card, CardContent, Typography } from "@mui/material";
import ContentProfileHeader from "../Tweets/ContentProfileHeader";
import ShowLikeOwner from "./ShowLikeOwner";
import CommentIcon from "@mui/icons-material/Comment";

const ShowMyLikesOnComment: React.FC<ShowMyLikesOnCommentProps> = ({
  item,
  link,
}) => {
  return (
    <Card key={item._id} sx={style1} elevation={4}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ContentProfileHeader
          style2={{}}
          imgSrc={item.comment?.owner.avatar || "content-avatar"}
          fullname={item.comment?.owner.fullname || "content-fullname"}
          username={item.comment?.owner.username || "content-username"}
          createdAt={item.comment?.updatedAt || "tweet-timestamp"}
        />
        <ShowLikeOwner timestamp={item.updatedAt} />
      </Box>
      {link && <Typography>link</Typography>}
      <CardContent sx={style5}>
        <CommentIcon fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="body1" color="textPrimary" sx={style6}>
          {item.comment?.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ShowMyLikesOnComment;

const style1 = { padding: "10px" };

const style5 = {
  p: 0, // shorthand for padding: 0
  "&:last-child": {
    pb: 0, // remove bottom padding
  },
  display: "flex",
  alignItems: "center",
};
const style6 = { mt: "5px", overflow: "hidden", textOverflow: "ellipsis" };

type ShowMyLikesOnCommentProps = {
  item: LikedItem;
  link: string | undefined;
};
