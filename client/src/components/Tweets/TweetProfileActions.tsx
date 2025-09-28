import React from "react";
import { CardActions, IconButton, Typography } from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import {
  style4,
  style7,
  style8,
  style9,
} from "../../constants/tweets.constants";
import CommenterCard from "./CommenterCard";
import useFetchCommentsOnTweets from "../../hooks/data-fetching/useFetchCommentsOnTweets";
import { CaptionTextCenter } from "../ui-components/TextStyledComponents";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import useMutateLikeUserTweet from "../../hooks/data-fetching/useMutateLikeUserTweet";

const TweetProfileActions: React.FC<TweetProfileActionsProps> = ({
  tweetId,
  handleShowComments,
  disabled,
  showComments,
  likeStatus,
}) => {
  const [like, setLike] = React.useState<boolean>(likeStatus);
  const toggleTweetLike = useMutateLikeUserTweet();
  const fetchCommentMutate = useFetchCommentsOnTweets();

  const handleCommentClick = () => {
    handleShowComments();
    fetchCommentMutate.mutate(tweetId);
  };
  const handleLikeClick = () => {
    toggleTweetLike.mutate(tweetId, {
      onSuccess: (data) => {
        if ("tweet" in data) {
          setLike(true);
        } else {
          setLike(false);
        }
      },
    });
  };

  return (
    <>
      <CardActions sx={style7}>
        <IconButton disabled={false} sx={style8} onClick={handleLikeClick}>
          <ThumbUpOffAltIcon
            fontSize="small"
            color={like ? "primary" : "action"}
          />
          <Typography
            variant="caption"
            color={like ? "primary" : "textSecondary"}
            sx={style4}
          >
            &nbsp;Like
          </Typography>
        </IconButton>
        {!disabled && (
          <IconButton sx={style8} onClick={handleCommentClick}>
            <CommentIcon fontSize="small" />
            <Typography variant="caption" color="textSecondary" sx={style9}>
              &nbsp;comments
            </Typography>
          </IconButton>
        )}
      </CardActions>
      {showComments && (
        <>
          <div>{fetchCommentMutate.isError && "Encountered Error"}</div>
          <div>
            {fetchCommentMutate.isSuccess === false ? (
              <CircularProgressCenter size={20} />
            ) : (
              <>
                {fetchCommentMutate.data?.comments.docs.length === 0 ? (
                  <CaptionTextCenter>no comments</CaptionTextCenter>
                ) : (
                  <>
                    {fetchCommentMutate.data?.comments.docs.map((comment) => (
                      <CommenterCard key={comment._id} comment={comment} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default TweetProfileActions;

type TweetProfileActionsProps = {
  tweetId: string;
  handleShowComments: () => void;
  disabled: boolean;
  showComments: boolean;
  likeStatus: boolean;
};
