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

const CommenterProfileActions: React.FC<CommenterProfileActionsProps> = ({
  ID,
  disabled,
}) => {
  const fetchCommentOnCommentMutate = useFetchCommentsOnComments();
  const handleShowReply = () => {
    fetchCommentOnCommentMutate.mutate(ID, {
      onSuccess: () => {},
    });
  };
  return (
    <>
      <CardActions sx={style7}>
        <IconButton disabled={false} sx={style8}>
          <ThumbUpOffAltIcon fontSize="small" color="action" />
          <Typography variant="caption" color="textSecondary" sx={style4}>
            &nbsp;Like
          </Typography>
        </IconButton>
        {!disabled && (
          <IconButton sx={style8} onClick={handleShowReply}>
            <CommentIcon fontSize="small" />
            <Typography variant="caption" color="textSecondary" sx={style9}>
              &nbsp;reply
            </Typography>
          </IconButton>
        )}
      </CardActions>
      {fetchCommentOnCommentMutate.isPending ? (
        <div>....Loading replies</div>
      ) : (
        <div>
          {fetchCommentOnCommentMutate.data?.comments.docs.map((reply) => {
            return (
              <div key={reply._id}>
                <RepliesCard reply={reply} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default CommenterProfileActions;

type CommenterProfileActionsProps = {
  ID: string;
  disabled: boolean;
};
