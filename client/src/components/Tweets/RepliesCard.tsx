import React from "react";
import { Card, CircularProgress } from "@mui/material";
import CommentTweetProfileHeader from "./CommentTweetProfileHeader";
import RepliesProfileActions from "./RepliesProfileActions";
import useCheckLikeOnComments from "../../hooks/data-fetching/useCheckLikeOnComments";
import useAuth from "../../hooks/useAuth";

const RepliesCard: React.FC<RepliesCardProps> = ({
  reply,
  tweetOwner,
  commentId,
}) => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useCheckLikeOnComments(reply._id);
  if (isLoading)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  if (isError) return <div>....Encountered Error</div>;
  if (!data) return <CircularProgress />;

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
      <RepliesProfileActions
        replyId={reply._id}
        replyOwner={user?.user._id === reply.owner._id}
        likeStatus={data.data}
        tweetOwner={tweetOwner}
        commentId={commentId}
      />
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
  tweetOwner: boolean;
  commentId: string;
};
