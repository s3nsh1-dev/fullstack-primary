import React from "react";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ThumbUpOutlined from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlined from "@mui/icons-material/ThumbDownOutlined";
import MoreVert from "@mui/icons-material/MoreVert";
import useToggleLikeOnComment from "../../hooks/data-fetching/useToggleLikeOnComment";
import useAuth from "../../hooks/useAuth";

const VideoCommentItem: React.FC<VideoCommentItemProps> = ({
  comment,
  theme,
}) => {
  const { user } = useAuth();
  const [like, setLike] = React.useState(comment.isLiked);
  const toggleLike = useToggleLikeOnComment();
  const handleLikes = () => {
    if (!user) return alert("Please Login to like this comment");
    toggleLike.mutate(comment._id, {
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
    <Stack direction="row" spacing={2}>
      <Avatar
        src={comment.owner.avatar}
        alt={comment.owner.fullname}
        sx={{ width: 40, height: 40 }}
      />
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
          <Stack direction={"row"} spacing={0.2} alignItems="center">
            <Typography
              variant="subtitle2"
              sx={{ color: theme.text, fontWeight: 600, fontSize: "1rem" }}
            >
              {comment.owner.fullname}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{comment.owner.username}
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{ color: theme.textSecondary, fontSize: "0.75rem" }}
          >
            ~{formatDate(comment.createdAt)}
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            color: theme.text,
            lineHeight: 1.5,
            mb: 1,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {comment.content}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            size="small"
            sx={{ color: theme.text, "&:hover": { bgcolor: theme.hoverBg } }}
            onClick={handleLikes}
          >
            <ThumbUpOutlined
              sx={{ fontSize: 18 }}
              color={like ? "primary" : "inherit"}
            />
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              color: theme.textSecondary,
              fontSize: "0.75rem",
              minWidth: 20,
            }}
          >
            ?
          </Typography>
          <IconButton
            size="small"
            sx={{ color: theme.text, "&:hover": { bgcolor: theme.hoverBg } }}
            disabled
          >
            <ThumbDownOutlined sx={{ fontSize: 18 }} />
          </IconButton>
          <Button
            size="small"
            sx={{
              color: theme.text,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.75rem",
              minWidth: "auto",
              px: 1,
              "&:hover": { bgcolor: theme.hoverBg },
            }}
          >
            Reply
          </Button>
          <IconButton
            size="small"
            sx={{
              color: theme.text,
              ml: "auto !important",
              "&:hover": { bgcolor: theme.hoverBg },
            }}
          >
            <MoreVert sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Box>
    </Stack>
  );
};

export default VideoCommentItem;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} week${
      Math.floor(diffDays / 7) > 1 ? "s" : ""
    } ago`;
  if (diffDays < 365)
    return `${Math.floor(diffDays / 30)} month${
      Math.floor(diffDays / 30) > 1 ? "s" : ""
    } ago`;
  return `${Math.floor(diffDays / 365)} year${
    Math.floor(diffDays / 365) > 1 ? "s" : ""
  } ago`;
};

type VideoCommentItemProps = {
  comment: {
    _id: string;
    content: string;
    video: string;
    owner: {
      _id: string;
      username: string;
      fullname: string;
      avatar: string;
    };
    createdAt: string;
    updatedAt: string;
    isLiked: boolean;
  };
  theme: ThemeType;
};

type ThemeType = {
  text: string;
  textSecondary: string;
  hoverBg: string;
};
