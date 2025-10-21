import { getDetailsForHomepage } from "../controllers/homepage.controller";
import { Router } from "express";

const HomeRouter = Router();

HomeRouter.route("/:username").get(getDetailsForHomepage);

export default HomeRouter;
