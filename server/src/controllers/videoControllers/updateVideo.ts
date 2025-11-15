import { isValidObjectId } from "mongoose";
import { Video } from "../../models/video.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadOnCloudinary } from "../../utils/cloudinary";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary";
import { isOwner } from "../../utils/checkIsOwner";

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description and thumbnail

  const { title, description } = req.body;
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID USER_ID");
  if (!req.user || !req.user.id) throw new ApiError(400, "USER_ID IS REQUIRED");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "VIDEO NOT FOUND");

  if (!isOwner(video.owner, req.user.id)) {
    throw new ApiError(403, "NOT AUTHORIZED TO UPDATE THIS VIDEO");
  }

  video.title = title || video.title;
  video.description = description || video.description;

  const previousThumbnailPublicId = video.thumbPublicId;
  const previousThumbnailURL = video.thumbnail;

  const files = req.file as Express.Multer.File;
  if (files) {
    const thumbnailLocalPath = files.path;
    if (thumbnailLocalPath) {
      const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
      if (!uploadedThumbnail)
        throw new ApiError(400, "THUMBNAIL UPLOAD FAILED");

      const foo = await deleteFromCloudinary(video.thumbPublicId);
      video.thumbnail = uploadedThumbnail.url || previousThumbnailURL;
      video.thumbPublicId =
        uploadedThumbnail.public_id || previousThumbnailPublicId;
    }
  }
  const updatedVideo = await video.save({ validateModifiedOnly: true });
  if (!updatedVideo) throw new ApiError(400, "VIDEO UPDATE FAILED");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video: updatedVideo },
        "VIDEO DETAILS UPDATED SUCCESSFULLY"
      )
    );
});

export { updateVideo };
