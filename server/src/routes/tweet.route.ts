import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
  fetchTweet,
} from "../controllers/tweet.controller";
import verifyJWT from "../middleware/auth.middleware";

const tweetRouter = Router();

tweetRouter.route("/").post(verifyJWT, createTweet);
tweetRouter.route("/user/:userId").get(getUserTweets);
tweetRouter
  .route("/:tweetId")
  .patch(verifyJWT, updateTweet)
  .delete(verifyJWT, deleteTweet)
  .get(fetchTweet);

export default tweetRouter;
