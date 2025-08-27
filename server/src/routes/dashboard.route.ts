import { Router } from "express";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller";
import verifyJWT from "../middleware/auth.middleware";

const dashboardRouter = Router();

dashboardRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

dashboardRouter.route("/stats").get(getChannelStats);
dashboardRouter.route("/videos").get(getChannelVideos);

export default dashboardRouter;
