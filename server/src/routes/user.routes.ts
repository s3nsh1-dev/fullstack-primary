import { Router } from "express";
import { registerUser } from "../controllers/user.controller";
import { multerUpload } from "../middleware/multer.middleware";

const userRouter = Router();

userRouter.route("/register").post(
  multerUpload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

export default userRouter;
