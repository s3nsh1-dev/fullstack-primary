import React from "react";
import {
  Card,
  CardActionArea,
  Stack,
  CardContent,
  Typography,
} from "@mui/material";
import ContentProfileHeader from "./ContentProfileHeader";
import CommenterProfileActions from "./CommenterProfileActions";
import useMode from "../../hooks/useMode";
import type { TweetCommentType } from "../../hooks/data-fetching/useFetchCommentsOnTweets";
import useAuth from "../../hooks/useAuth";
import { style1, style5, style6 } from "../../constants/tweets.constants";

const CommenterCard: React.FC<CommenterCardProps> = ({
  comment,
  tweetOwner,
  tweetId,
  isLiked,
}) => {
  const { mode } = useMode();
  const { user } = useAuth();
  const styleMode2 = {
    m: "0.5% 1% 1% 1%",
    backgroundColor: mode ? "Whitesmoke" : "black",
    boxShadow: "none",
  };

  return (
    <Card sx={styleMode2}>
      <CardActionArea sx={style1}>
        <Stack direction="column" spacing={1} alignItems="start">
          <ContentProfileHeader
            imgSrc={comment.owner.avatar}
            fullname={comment.owner.fullname || "fake-fullname"}
            style2={{}}
            username={comment.owner.username || "fake-username"}
            createdAt={comment.createdAt}
          />
          <CardContent sx={style5}>
            <Typography variant="body1" color="textPrimary" sx={style6}>
              {comment.content}
            </Typography>
          </CardContent>
        </Stack>
      </CardActionArea>
      <CommenterProfileActions
        commentOwner={user?.user._id === comment.owner._id}
        tweetOwner={tweetOwner}
        commentId={comment._id}
        disabled={false}
        likeStatus={isLiked}
        tweetId={tweetId}
      />
    </Card>
  );
};

export default CommenterCard;

type CommenterCardProps = {
  comment: TweetCommentType;
  tweetOwner: boolean;
  tweetId: string;
  isLiked: boolean;
};
