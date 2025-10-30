import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  fetchUserById,
  usernameAvailability,
  newUsernameUpdate,
} from "../controllers/user.controller";
import {
  addToWatchHistory,
  getWatchHistory,
} from "../controllers/watchHistory.controller";
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
userRouter.route("/profile/:userId").get(fetchUserById);
//secured routes
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refresh-token").get(refreshAccessToken);
userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/update-account").patch(verifyJWT, updateAccountDetails);
userRouter
  .route("/avatar")
  .patch(verifyJWT, multerUpload.single("avatar"), updateUserAvatar);
userRouter
  .route("/cover")
  .patch(verifyJWT, multerUpload.single("coverImage"), updateUserCoverImage);
userRouter.route("/channel/:username").get(getUserChannelProfile);
userRouter.route("/history").get(verifyJWT, getWatchHistory);
userRouter.route("/history/:videoId").post(addToWatchHistory);
userRouter.route("/check-username").get(verifyJWT, usernameAvailability);
userRouter.route("/update/username").patch(verifyJWT, newUsernameUpdate);

export default userRouter;

// verifyJWT should also run when i request /refresh
// but right now i do not have a /refresh so whats up with that?
