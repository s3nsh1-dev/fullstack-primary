import verifyJWT from "../middleware/auth.middleware";
import { getDetailsForHomepage } from "../controllers/homepage.controller";
import { Router } from "express";

const HomeRouter = Router();

HomeRouter.use(verifyJWT);
HomeRouter.route("/:user_ID").get(getDetailsForHomepage);

export default HomeRouter;
