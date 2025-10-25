import React from "react";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
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
import UpdateIcon from "@mui/icons-material/Update";
import useDeleteComment from "../../hooks/data-fetching/useDeleteComment";
import { useQueryClient } from "@tanstack/react-query";
import FormModal from "../others/FormModal";
import UpdateCommentForm from "./UpdateCommentForm";
import useAuth from "../../hooks/useAuth";

const CommenterProfileActions: React.FC<CommenterProfileActionsProps> = ({
  commentOwner,
  tweetOwner,
  commentId,
  disabled,
  likeStatus,
  tweetId,
}) => {
  const { user } = useAuth();
  const [like, setLike] = React.useState<boolean>(likeStatus);
  const [showReplies, setShowReplies] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const toggleTweetLike = useToggleLikeOnComment();
  const { data, isLoading, isError, refetch } =
    useFetchCommentsOnComments(commentId);
  const queryClient = useQueryClient();
  const deleteCommentMutate = useDeleteComment();

  const handleShowReply = () => {
    setShowReplies(!showReplies);
    refetch();
  };
  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };
  const handleCommentLike = () => {
    if (!user) return alert("Please login to like the comment");
    toggleTweetLike.mutate(commentId, {
      onSuccess: (data) => {
        if ("comment" in data) {
          setLike(true);
        } else {
          setLike(false);
        }
      },
    });
  };
  const handleDeleteClick = () => {
    deleteCommentMutate.mutate(commentId, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: ["commentOnTweet", tweetId],
        });
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
        {commentOwner && (
          <>
            <IconButton sx={style8} onClick={handleToggleModal}>
              <UpdateIcon fontSize="small" color="success" />
              <Typography variant="caption" color="success" sx={style9}>
                &nbsp;update
              </Typography>
            </IconButton>
          </>
        )}
        {(tweetOwner || commentOwner) && (
          <>
            <IconButton sx={style8} onClick={handleDeleteClick}>
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
          <AddReplyOnComment commentId={commentId} />
          {data?.comments.docs.length === 0 ? (
            <CaptionTextCenter>no replies</CaptionTextCenter>
          ) : (
            <>
              {data?.comments.docs.map((reply) => (
                <RepliesCard
                  key={reply._id}
                  reply={reply}
                  tweetOwner={tweetOwner}
                  commentId={commentId}
                  isLiked={reply.isLiked}
                />
              ))}
            </>
          )}
        </>
      )}
      {openModal && (
        <FormModal open={openModal} toggleModal={() => setOpenModal(false)}>
          <UpdateCommentForm
            commentId={commentId}
            tweetId={tweetId}
            closeModal={() => setOpenModal(false)}
          />
        </FormModal>
      )}
    </>
  );
};

export default CommenterProfileActions;

type CommenterProfileActionsProps = {
  commentOwner: boolean;
  commentId: string;
  disabled: boolean;
  likeStatus: boolean;
  tweetOwner: boolean;
  tweetId: string;
};
