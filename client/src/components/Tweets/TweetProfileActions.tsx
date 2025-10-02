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
import AddTweetCommentForm from "./AddTweetCommentForm";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import useDeleteTweet from "../../hooks/data-fetching/useDeleteTweet";
import useAuth from "../../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import FormModal from "../others/FormModal";
import UpdateTweetContentForm from "./UpdateTweetContentForm";

const TweetProfileActions: React.FC<TweetProfileActionsProps> = ({
  tweetOwner,
  tweetId,
  handleShowComments,
  disabled,
  showComments,
  likeStatus,
}) => {
  const { user } = useAuth();
  const deleteTweetMutate = useDeleteTweet();
  const queryClient = useQueryClient();
  const [like, setLike] = React.useState<boolean>(likeStatus);
  const [openModal, setOpenModal] = React.useState(false);
  const toggleTweetLike = useMutateLikeUserTweet();
  const { data, isLoading, isError, refetch } =
    useFetchCommentsOnTweets(tweetId);
  if (isLoading) return <CircularProgressCenter size={20} />;
  if (isError) return <div>....Encountered Error</div>;

  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleCommentClick = () => {
    handleShowComments();
    refetch();
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
  const handleDeleteClick = () => {
    deleteTweetMutate.mutate(tweetId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["singleTweet", tweetId],
        });
        queryClient.refetchQueries({
          queryKey: ["userTweets", user?.user._id],
        });
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
            <CommentIcon fontSize="small" color="secondary" />
            <Typography variant="caption" color="secondary" sx={style9}>
              &nbsp;comments
            </Typography>
          </IconButton>
        )}
        {tweetOwner && (
          <>
            <IconButton sx={style8} onClick={handleToggleModal}>
              <UpdateIcon fontSize="small" color="success" />
              <Typography variant="caption" color="success" sx={style9}>
                &nbsp;update
              </Typography>
            </IconButton>
            <IconButton sx={style8} onClick={handleDeleteClick}>
              <DeleteOutlineIcon fontSize="small" color="error" />
              <Typography variant="caption" color="error" sx={style9}>
                &nbsp;delete
              </Typography>
            </IconButton>
          </>
        )}
      </CardActions>

      {showComments && (
        <>
          <div>
            <>
              <AddTweetCommentForm ID={tweetId} />
              {data?.comments.docs.length === 0 ? (
                <CaptionTextCenter>no comments</CaptionTextCenter>
              ) : (
                <>
                  {data?.comments.docs.map((comment) => (
                    <CommenterCard
                      key={comment._id}
                      comment={comment}
                      tweetOwner={tweetOwner}
                      tweetId={tweetId}
                    />
                  ))}
                </>
              )}
            </>
          </div>
        </>
      )}
      {openModal && (
        <FormModal open={openModal} toggleModal={() => setOpenModal(false)}>
          <UpdateTweetContentForm
            tweetId={tweetId}
            closeModal={() => setOpenModal(false)}
          />
        </FormModal>
      )}
    </>
  );
};

export default TweetProfileActions;

type TweetProfileActionsProps = {
  tweetOwner: boolean;
  tweetId: string;
  handleShowComments: () => void;
  disabled: boolean;
  showComments: boolean;
  likeStatus: boolean;
};
