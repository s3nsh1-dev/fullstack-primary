import { getAllVideos } from "./videoControllers/getAllVideos";
import { publishAVideo } from "./videoControllers/publishAVideo";
import { updateVideo } from "./videoControllers/updateVideo";
import { toggleVideoPublishStatus } from "./videoControllers/toggleVideoPublishStatus";
import { deleteVideo } from "./videoControllers/deleteVideo";
import { getVideoById } from "./videoControllers/getVideoById";
import { getAllVideosWithoutRestriction } from "./videoControllers/getAllVideosWithoutRestriction";

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  getAllVideosWithoutRestriction,
  toggleVideoPublishStatus,
};
