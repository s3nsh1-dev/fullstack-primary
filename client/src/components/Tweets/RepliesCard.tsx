import React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ContentProfileHeader from "./ContentProfileHeader";
import RepliesProfileActions from "./RepliesProfileActions";
import useAuth from "../../hooks/useAuth";
import { style1, style5, style6 } from "../../constants/tweets.constants";

const RepliesCard: React.FC<RepliesCardProps> = ({
  reply,
  tweetOwner,
  commentId,
  isLiked,
}) => {
  const { user } = useAuth();

  const styleMode2 = {
    m: "0.5% 1% 1% 1%",
    boxShadow: "none",
  };
  return (
    <Card sx={styleMode2}>
      <CardActionArea sx={style1}>
        <Stack direction="column" spacing={1} alignItems="start">
          <ContentProfileHeader
            imgSrc={reply.owner.avatar}
            fullname={reply.owner.fullname || "fake-fullname"}
            style2={{}}
            username={reply.owner.username || "fake-username"}
            createdAt={reply.createdAt}
            type="comment"
          />
          <CardContent sx={style5}>
            <Typography variant="body1" color="textPrimary" sx={style6}>
              {reply.content}
            </Typography>
          </CardContent>
        </Stack>
      </CardActionArea>
      <RepliesProfileActions
        replyId={reply._id}
        replyOwner={user?.user._id === reply.owner._id}
        likeStatus={isLiked}
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
  isLiked: boolean;
};
