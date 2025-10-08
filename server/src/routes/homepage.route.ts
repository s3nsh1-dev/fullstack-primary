import verifyJWT from "../middleware/auth.middleware";
import { getDetailsForHomepage } from "../controllers/homepage.controller";
import { Router } from "express";

const HomeRouter = Router();

HomeRouter.use(verifyJWT);
HomeRouter.route("/:username").get(getDetailsForHomepage);

export default HomeRouter;
