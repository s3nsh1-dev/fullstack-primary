import { getFeed } from "../controllers/feed.controller";
import { Router } from "express";

const feedRouter = Router();

feedRouter.get("/", getFeed);

export default feedRouter;
