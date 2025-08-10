import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller";
import { multerUpload } from "../middleware/multer.middleware";
import verifyJWT from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.route("/register").post(
  multerUpload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);

//secured routes
userRouter.route("/logout").post(verifyJWT, logoutUser);

export default userRouter;
