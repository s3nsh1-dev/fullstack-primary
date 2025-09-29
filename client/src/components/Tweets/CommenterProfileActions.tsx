import React from "react";
import { CardActions, IconButton, Typography } from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import useFetchCommentsOnComments from "../../hooks/data-fetching/useFetchCommentsOnComments";
import RepliesCard from "./RepliesCard";
import {
  style4,
  style7,
  style8,
  style9,
} from "../../constants/tweets.constants";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import { CaptionTextCenter } from "../ui-components/TextStyledComponents";
import useToggleLikeOnComment from "../../hooks/data-fetching/useToggleLikeOnComment";
import AddReplyOnComment from "./AddReplyOnComment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const CommenterProfileActions: React.FC<CommenterProfileActionsProps> = ({
  alterComment,
  ID,
  disabled,
  likeStatus,
}) => {
  const [like, setLike] = React.useState<boolean>(likeStatus);
  const [showReplies, setShowReplies] = React.useState(false);
  const toggleTweetLike = useToggleLikeOnComment();
  const { data, isLoading, isError, refetch } = useFetchCommentsOnComments(ID);

  const handleShowReply = () => {
    setShowReplies(!showReplies);
    refetch();
  };

  const handleCommentLike = () => {
    toggleTweetLike.mutate(ID, {
      onSuccess: (data) => {
        if ("comment" in data) {
          setLike(true);
        } else {
          setLike(false);
        }
      },
    });
  };

  if (isLoading) return <CircularProgressCenter size={20} />;
  if (isError) return <div>....Encountered Error</div>;

  return (
    <>
      <CardActions sx={style7}>
        <IconButton disabled={false} sx={style8} onClick={handleCommentLike}>
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
          <IconButton sx={style8} onClick={handleShowReply}>
            <CommentIcon fontSize="small" color="secondary" />
            <Typography variant="caption" color="secondary" sx={style9}>
              &nbsp;reply
            </Typography>
          </IconButton>
        )}
        {alterComment && (
          <>
            <IconButton sx={style8}>
              <DeleteOutlineIcon fontSize="small" color="error" />
              <Typography variant="caption" color="error" sx={style9}>
                &nbsp;delete
              </Typography>
            </IconButton>
          </>
        )}
      </CardActions>
      {showReplies && (
        <>
          <AddReplyOnComment ID={ID} />
          {data?.comments.docs.length === 0 ? (
            <CaptionTextCenter>no replies</CaptionTextCenter>
          ) : (
            <>
              {data?.comments.docs.map((reply) => (
                <RepliesCard key={reply._id} reply={reply} />
              ))}
            </>
          )}
        </>
      )}
    </>
  );
};

export default CommenterProfileActions;

type CommenterProfileActionsProps = {
  alterComment: boolean;
  ID: string;
  disabled: boolean;
  likeStatus: boolean;
};
