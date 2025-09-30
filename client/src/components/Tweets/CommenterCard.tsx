import React from "react";
import { Card, CircularProgress } from "@mui/material";
import CommentTweetProfileHeader from "./CommentTweetProfileHeader";
import CommenterProfileActions from "./CommenterProfileActions";
import useMode from "../../hooks/useMode";
import type { TweetCommentType } from "../../hooks/data-fetching/useFetchCommentsOnTweets";
import useCheckLikeOnComments from "../../hooks/data-fetching/useCheckLikeOnComments";
import useAuth from "../../hooks/useAuth";

const CommenterCard: React.FC<CommenterCardProps> = ({ comment }) => {
  const { mode } = useMode();
  const { user } = useAuth();
  const styleMode2 = {
    m: "0.5% 1% 1% 1%",
    backgroundColor: mode ? "Whitesmoke" : "black",
    boxShadow: "none",
  };
  const { data, isLoading, isError } = useCheckLikeOnComments(comment._id);
  if (isLoading)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  if (isError) return <div>....Encountered Error</div>;
  if (!data) return <CircularProgress />;
  console.log(comment.content, comment._id);

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
      <CommenterProfileActions
        alterComment={user?.user._id === comment.owner._id}
        ID={comment._id}
        disabled={false}
        likeStatus={data.data}
      />
    </Card>
  );
};

export default CommenterCard;

type CommenterCardProps = {
  comment: TweetCommentType;
};
