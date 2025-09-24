import React from "react";
import { Card } from "@mui/material";
import Sample3 from "./Sample3";
import Sample4 from "./Sample4";
import useMode from "../../hooks/useMode";
import type { TweetCommentType } from "../../hooks/data-fetching/useFetchCommentsOnTweets";

const Sample5: React.FC<Sample5Props> = ({ comment }) => {
  const { mode } = useMode();
  const styleMode2 = {
    m: "0.5% 1% 1% 1%",
    backgroundColor: mode ? "rgb(255,255,255)" : "rgb(0,0,0,0.2)",
  };
  return (
    <Card sx={styleMode2}>
      <Sample3 comment={comment} />
      <Sample4 comment={comment} disabled={false} />
    </Card>
  );
};

export default Sample5;

type Sample5Props = {
  comment: TweetCommentType;
};
