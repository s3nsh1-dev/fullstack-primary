import React from "react";
import { Card } from "@mui/material";
import CommentTweetProfileHeader from "./CommentTweetProfileHeader";
import CommenterProfileActions from "./CommenterProfileActions";
import useMode from "../../hooks/useMode";
import type { TweetCommentType } from "../../hooks/data-fetching/useFetchCommentsOnTweets";

const CommenterCard: React.FC<CommenterCardProps> = ({ comment }) => {
  const { mode } = useMode();
  const styleMode2 = {
    m: "0.5% 1% 1% 1%",
    backgroundColor: mode ? "Whitesmoke" : "black",
    boxShadow: "none",
  };
  return (
    <Card sx={styleMode2}>
      <CommentTweetProfileHeader
        imgSrc={comment.owner.avatar}
        fullname={comment.owner.fullname || "fake-fullname"}
        style2={{}}
        content={comment.content}
        username={comment.owner.username || "fake-username"}
        createdAt={comment.createdAt}
      />
      <CommenterProfileActions ID={comment._id} disabled={false} />
    </Card>
  );
};

export default CommenterCard;

type CommenterCardProps = {
  comment: TweetCommentType;
};
