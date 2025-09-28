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

const CommenterProfileActions: React.FC<CommenterProfileActionsProps> = ({
  ID,
  disabled,
}) => {
  const [showReplies, setShowReplies] = React.useState(false);
  const fetchCommentOnCommentMutate = useFetchCommentsOnComments();
  const handleShowReply = () => {
    setShowReplies(!showReplies);
    fetchCommentOnCommentMutate.mutate(ID);
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
      {showReplies && (
        <>
          <div>
            {fetchCommentOnCommentMutate.isError && "Encountered Error"}
          </div>
          <div>
            {fetchCommentOnCommentMutate.isPending ? (
              <CircularProgressCenter size={20} />
            ) : (
              <>
                {fetchCommentOnCommentMutate.data?.comments.docs.length ===
                0 ? (
                  <CaptionTextCenter>no replies</CaptionTextCenter>
                ) : (
                  <>
                    {fetchCommentOnCommentMutate.data?.comments.docs.map(
                      (reply) => (
                        <RepliesCard key={reply._id} reply={reply} />
                      )
                    )}
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

export default CommenterProfileActions;

type CommenterProfileActionsProps = {
  ID: string;
  disabled: boolean;
};
