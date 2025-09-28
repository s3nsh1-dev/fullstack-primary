import React from "react";
import { CardActions, IconButton, Typography } from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { style4, style7, style8 } from "../../constants/tweets.constants";
import useToggleLikeOnComment from "../../hooks/data-fetching/useToggleLikeOnComment";

const RepliesProfileActions: React.FC<RepliesProfileActionsProps> = ({
  ID,
  likeStatus,
}) => {
  const [like, setLike] = React.useState<boolean>(likeStatus);
  const toggleTweetLike = useToggleLikeOnComment();

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
      </CardActions>
    </>
  );
};

export default RepliesProfileActions;

type RepliesProfileActionsProps = {
  ID: string;
  likeStatus: boolean;
};
