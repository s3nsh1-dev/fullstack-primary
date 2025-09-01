import { Router } from "express";
import {
  addVideoComment,
  addTweetComment,
  deleteComment,
  getVideoComments,
  updateComment,
  getTweetComments,
} from "../controllers/comment.controller";
import verifyJWT from "../middleware/auth.middleware";

const commentRouter = Router();

commentRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

commentRouter.route("/v/:video_ID").get(getVideoComments).post(addVideoComment);
commentRouter.route("/t/:tweet_ID").get(getTweetComments).post(addTweetComment);
commentRouter
  .route("/c/:comment_ID")
  .delete(deleteComment)
  .patch(updateComment);

export default commentRouter;
