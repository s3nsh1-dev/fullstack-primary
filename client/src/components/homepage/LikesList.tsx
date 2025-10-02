import { Box, Avatar, Typography } from "@mui/material";

import type {
  LikedType,
  VideoLike,
  CommentLike,
  TweetLike,
} from "../../constants/dataTypes";

// Type guards for narrowing
const isVideoLike = (like: LikedType): like is VideoLike => "video" in like;
const isCommentLike = (like: LikedType): like is CommentLike =>
  "comment" in like;
const isTweetLike = (like: LikedType): like is TweetLike => "tweet" in like;

export default function LikesList({ data }: { data: LikedType[] }) {
  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      {data.map((item) => {
        if (isVideoLike(item)) {
          return (
            <Box key={item._id} p={2} border="1px solid #ddd" borderRadius={2}>
              <Typography variant="h6">🎬 Video</Typography>
              <Typography>{item.video.title}</Typography>
              <img
                src={item.video.thumbnail}
                alt={item.video.title}
                style={{ width: 200, borderRadius: 8 }}
              />
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Avatar src={item.video.owner.avatar} />
                <Typography>{item.video.owner.fullname}</Typography>
              </Box>
            </Box>
          );
        }

        if (isCommentLike(item)) {
          return (
            <Box key={item._id} p={2} border="1px solid #ddd" borderRadius={2}>
              <Typography variant="h6">💬 Comment</Typography>
              <Typography>{item.comment.content}</Typography>

              {/* Comment's video */}
              <Box mt={1}>
                <Typography variant="subtitle2">on Video:</Typography>
                <Typography>{item.comment?.video?.title}</Typography>
                <img
                  src={item.comment?.video?.thumbnail}
                  alt={item.comment?.video?.title}
                  style={{ width: 200, borderRadius: 8 }}
                />
              </Box>

              {/* Comment owner */}
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Avatar src={item.comment.owner.avatar} sizes="small" />
                <Typography>{item.comment.owner.fullname}</Typography>
              </Box>
            </Box>
          );
        }

        if (isTweetLike(item)) {
          return (
            <Box key={item._id} p={2} border="1px solid #ddd" borderRadius={2}>
              <Typography variant="h6">🐦 Tweet</Typography>
              <Typography>"{item.tweet?.content}"</Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Avatar src={item.tweet.owner.avatar} />
                <Typography>{item.tweet.owner.fullname}</Typography>
              </Box>
            </Box>
          );
        }

        return null;
      })}
    </Box>
  );
}
