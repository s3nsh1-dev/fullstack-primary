import { Router } from "express";
import {
  healthCheck,
  checkUserAuthDetails,
} from "../controllers/healthCheck.controller";
import verifyJWT from "../middleware/auth.middleware";

const healthCheckRouter = Router();
healthCheckRouter.use(verifyJWT);

healthCheckRouter.route("/").get(healthCheck);
healthCheckRouter.route("/user").get(checkUserAuthDetails);

export default healthCheckRouter;
