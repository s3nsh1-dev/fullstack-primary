import React from "react";
import { Card } from "@mui/material";
import type { LikedItem } from "../../hooks/data-fetching/useFetchLikedContent";
const ShowMyLikesOnVideo: React.FC<ShowMyLikesOnVideoProps> = ({ item }) => {
  console.log("video", item.video);
  return <Card sx={style1} elevation={4}></Card>;
};

export default ShowMyLikesOnVideo;

type ShowMyLikesOnVideoProps = {
  item: LikedItem;
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
