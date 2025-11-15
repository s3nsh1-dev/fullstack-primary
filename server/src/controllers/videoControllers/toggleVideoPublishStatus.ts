import { isValidObjectId } from "mongoose";
import { Video } from "../../models/video.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { isOwner } from "../../utils/checkIsOwner";

const toggleVideoPublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID USER_ID");
  if (!req.user || !req.user.id) throw new ApiError(400, "USER_ID IS REQUIRED");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "VIDEO NOT FOUND");

  if (!isOwner(video.owner, req.user.id))
    throw new ApiError(403, "NOT AUTHORIZED TO TOGGLE THIS VIDEO");

  video.isPublished = !video.isPublished;
  const updatedVideo = await video.save({ validateModifiedOnly: true });
  if (!updatedVideo)
    throw new ApiError(400, "VIDEO PUBLISHED STATUS UNCHANGED");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video: updatedVideo },
        "VIDEO PUBLISH STATUS TOGGLED SUCCESSFULLY"
      )
    );
});

export { toggleVideoPublishStatus };
