import React from "react";
import { CardActions, IconButton, Typography } from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import useFetchCommentsOnComments from "../../hooks/data-fetching/useFetchCommentsOnComments";
import Sample6 from "./Sample6";

const style4 = { position: "relative", top: "2px" };
const style7 = { mt: 0, p: 0, padding: "10px" };
const style8 = {
  borderRadius: "5px",
  padding: "2px 5px",
};
const style9 = { position: "relative", top: "1px" };

const Sample4: React.FC<Sample2Props> = ({ ID, disabled }) => {
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
          <ThumbUpOffAltIcon fontSize="small" color="primary" />
          <Typography
            variant="caption"
            // color="textSecondary"
            color="primary"
            sx={style4}
          >
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
                <Sample6 reply={reply} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Sample4;

type Sample2Props = {
  ID: string;
  disabled: boolean;
};
