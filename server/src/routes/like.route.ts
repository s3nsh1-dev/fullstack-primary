import { Router } from "express";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleVideoLike,
  toggleTweetLike,
  getLikedComments,
  getLikedTweets,
  getEveryLikedContent,
  isTweetLiked,
  isCommentLiked,
  isVideoLiked,
} from "../controllers/like.controller";
import verifyJWT from "../middleware/auth.middleware";

const likeRouter = Router();
likeRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

likeRouter.route("/toggle/v/:videoId").post(toggleVideoLike);
likeRouter.route("/toggle/c/:commentId").post(toggleCommentLike);
likeRouter.route("/toggle/t/:tweetId").post(toggleTweetLike);
likeRouter.route("/videos").get(getLikedVideos);
likeRouter.route("/comments").get(getLikedComments);
likeRouter.route("/tweets").get(getLikedTweets);
likeRouter.route("/content/:userId").get(getEveryLikedContent);
likeRouter.route("/check-tweet/:tweetId").get(isTweetLiked);
likeRouter.route("/check-comment/:commentId").get(isCommentLiked);
likeRouter.route("/check-video/:videoId").get(isVideoLiked);

export default likeRouter;
