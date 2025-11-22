import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  toggleVideoPublishStatus,
  updateVideo,
  getAllVideosWithoutRestriction,
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
  .route("/w/restriction")
  .get(verifyJWT, getAllVideosWithoutRestriction);

videoRouter
  .route("/toggle/publish/:videoId")
  .patch(verifyJWT, toggleVideoPublishStatus);

videoRouter
  .route("/:videoId")
  .delete(verifyJWT, deleteVideo)
  .patch(verifyJWT, multerUpload.single("thumbnail"), updateVideo)
  .get(getVideoById);

export default videoRouter;
