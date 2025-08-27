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
videoRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

videoRouter
  .route("/")
  .get(getAllVideos)
  .post(
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
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(multerUpload.single("thumbnail"), updateVideo);

videoRouter.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default videoRouter;
