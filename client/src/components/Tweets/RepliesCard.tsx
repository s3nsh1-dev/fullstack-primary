import React from "react";
import { Card } from "@mui/material";
import CommentTweetProfileHeader from "./CommentTweetProfileHeader";
import RepliesProfileActions from "./RepliesProfileActions";

const RepliesCard: React.FC<RepliesCardProps> = ({ reply }) => {
  const styleMode2 = {
    m: "0.5% 1% 1% 1%",
    boxShadow: "none",
  };
  return (
    <Card sx={styleMode2}>
      <CommentTweetProfileHeader
        imgSrc={reply.owner.avatar}
        fullname={reply.owner.fullname || "fake-fullname"}
        style2={{}}
        content={reply.content}
        username={reply.owner.username || "fake-username"}
        createdAt={reply.createdAt}
      />
      <RepliesProfileActions ID={reply._id} disabled={true} />
    </Card>
  );
};

export default RepliesCard;

type RepliesCardProps = {
  reply: {
    _id: string;
    content: string;
    owner: {
      _id: string;
      fullname: string;
      avatar: string;
      username: string;
    };
    createdAt: string;
    updatedAt: string;
  };
};
