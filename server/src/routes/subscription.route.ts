import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribersCount,
  toggleSubscription,
} from "../controllers/subscription.controller";
import verifyJWT from "../middleware/auth.middleware";

const subscriptionRouter = Router();
// subscriptionRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

subscriptionRouter
  .route("/c/:channelId")
  .get(getUserChannelSubscribersCount)
  .post(verifyJWT, toggleSubscription);

subscriptionRouter.route("/u/:subscriberId").get(getSubscribedChannels);

export default subscriptionRouter;
