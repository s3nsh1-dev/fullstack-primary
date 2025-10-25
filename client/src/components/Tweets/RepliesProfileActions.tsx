import React from "react";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import {
  style4,
  style7,
  style8,
  style9,
} from "../../constants/tweets.constants";
import useToggleLikeOnComment from "../../hooks/data-fetching/useToggleLikeOnComment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UpdateIcon from "@mui/icons-material/Update";
import FormModal from "../others/FormModal";
import UpdateReplyForm from "./UpdateReplyForm";
import useDeleteComment from "../../hooks/data-fetching/useDeleteComment";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";

const RepliesProfileActions: React.FC<RepliesProfileActionsProps> = ({
  replyId,
  likeStatus,
  replyOwner,
  tweetOwner,
  commentId,
}) => {
  const { user } = useAuth();
  const [like, setLike] = React.useState<boolean>(likeStatus);
  const [openModal, setOpenModal] = React.useState(false);
  const toggleTweetLike = useToggleLikeOnComment();
  const queryClient = useQueryClient();
  const deleteCommentMutate = useDeleteComment();

  const handleCommentLike = () => {
    if (!user) return alert("Please login to like the reply");
    toggleTweetLike.mutate(replyId, {
      onSuccess: (data) => {
        if ("comment" in data) {
          setLike(true);
        } else {
          setLike(false);
        }
      },
    });
  };

  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleDeleteReply = () => {
    deleteCommentMutate.mutate(replyId, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: ["replyOnComments", commentId],
        });
      },
    });
  };

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
        {replyOwner && (
          <>
            <IconButton sx={style8} onClick={handleToggleModal}>
              <UpdateIcon fontSize="small" color="success" />
              <Typography variant="caption" color="success" sx={style9}>
                &nbsp;update
              </Typography>
            </IconButton>
          </>
        )}
        {(replyOwner || tweetOwner) && (
          <>
            <IconButton sx={style8} onClick={handleDeleteReply}>
              <DeleteOutlineIcon fontSize="small" color="error" />
              <Typography variant="caption" color="error" sx={style9}>
                &nbsp;delete
              </Typography>
            </IconButton>
          </>
        )}
      </CardActions>
      {openModal && (
        <FormModal open={openModal} toggleModal={() => setOpenModal(false)}>
          <UpdateReplyForm
            parentCommentId={commentId}
            commentId={replyId}
            closeModal={() => setOpenModal(false)}
          />
        </FormModal>
      )}
    </>
  );
};

export default RepliesProfileActions;

type RepliesProfileActionsProps = {
  replyOwner: boolean;
  replyId: string;
  likeStatus: boolean;
  tweetOwner: boolean;
  commentId: string;
};
