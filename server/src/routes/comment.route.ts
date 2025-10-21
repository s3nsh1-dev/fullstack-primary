import { Router } from "express";
import {
  addVideoComment,
  addTweetComment,
  deleteComment,
  getVideoComments,
  updateComment,
  getTweetComments,
  addCommentToComment,
  getCommentsComment,
} from "../controllers/comment.controller";
import verifyJWT from "../middleware/auth.middleware";

const commentRouter = Router();

commentRouter
  .route("/v/:video_ID")
  .get(getVideoComments)
  .post(verifyJWT, addVideoComment);
commentRouter
  .route("/t/:tweet_ID")
  .get(getTweetComments)
  .post(verifyJWT, addTweetComment);
commentRouter
  .route("/modify/:comment_ID")
  .delete(verifyJWT, deleteComment)
  .patch(verifyJWT, updateComment);
commentRouter
  .route("/c/:comment_ID")
  .post(verifyJWT, addCommentToComment)
  .get(getCommentsComment);

export default commentRouter;
