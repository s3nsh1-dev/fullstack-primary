import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller";
import verifyJWT from "../middleware/auth.middleware";

const commentRouter = Router();

commentRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

commentRouter.route("/:video_ID").get(getVideoComments).post(addComment);
commentRouter
  .route("/c/:comment_ID")
  .delete(deleteComment)
  .patch(updateComment);

export default commentRouter;
