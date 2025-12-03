import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import type { LikedItem } from "../../hooks/data-fetching/useFetchLikedContent";
import ContentProfileHeader from "../Tweets/ContentProfileHeader";
import ShowLikeOwner from "./ShowLikeOwner";
import VideoAccordion from "./VideoAccordion";

const ShowMyLikesOnVideo: React.FC<ShowMyLikesOnVideoProps> = ({
  item,
  link,
}) => {
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
          imgSrc={item.video?.owner.avatar || "content-avatar"}
          fullname={item.video?.owner.fullname || "content-fullname"}
          username={item.video?.owner.username || "content-username"}
          createdAt={item.video?.updatedAt || "tweet-timestamp"}
        />
        <ShowLikeOwner timestamp={item.updatedAt} />
      </Box>
      {link && <Typography>link</Typography>}
      <CardContent sx={style5}>
        <VideoAccordion item={item} />
      </CardContent>
    </Card>
  );
};

export default ShowMyLikesOnVideo;

type ShowMyLikesOnVideoProps = {
  item: any;
  link: string | undefined;
};

const style1 = { padding: "10px", backgroundColor: "#ff3f3fb7" };

const style5 = {
  p: 0, // shorthand for padding: 0
  "&:last-child": {
    pb: 0, // remove bottom padding
  },
  // display: "flex",
  // alignItems: "center",
};
// const style6 = { mt: "5px", overflow: "hidden", textOverflow: "ellipsis" };
