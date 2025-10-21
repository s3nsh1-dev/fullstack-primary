import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller";
import verifyJWT from "../middleware/auth.middleware";
import { multerUpload } from "../middleware/multer.middleware";

const videoRouter = Router();

videoRouter
  .route("/")
  .get(getAllVideos)
  .post(
    verifyJWT,
    multerUpload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

videoRouter
  .route("/:videoId")
  .delete(verifyJWT, deleteVideo)
  .patch(verifyJWT, multerUpload.single("thumbnail"), updateVideo);

videoRouter
  .route("/toggle/publish/:videoId")
  .patch(verifyJWT, togglePublishStatus);

// videoRouter.route("/:videoId/:userId?").get(getVideoById);
videoRouter.route("/:videoId").get(getVideoById);

export default videoRouter;
