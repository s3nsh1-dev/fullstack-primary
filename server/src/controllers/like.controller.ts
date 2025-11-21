import { toggleVideoLike } from "./likeController/toggleVideoLike";
import { toggleCommentLike } from "./likeController/toggleCommentLike";
import { toggleTweetLike } from "./likeController/toggleTweetLike";
import { getLikedVideos } from "./likeController/getLikedVideos";
import { getLikedTweets } from "./likeController/getLikedTweets";
import { isTweetLiked } from "./likeController/isTweetLiked";
import { isCommentLiked } from "./likeController/isCommentLiked";
import { isVideoLiked } from "./likeController/isVideoLiked";
import { getLikedComments } from "./likeController/getLikedComments";
import { getEveryLikedContent } from "./likeController/getEveryLikedContent";

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  getLikedComments,
  getLikedTweets,
  getEveryLikedContent,
  isTweetLiked,
  isCommentLiked,
  isVideoLiked,
};
