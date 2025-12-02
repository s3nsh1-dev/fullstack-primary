import { Video } from "../../models/video.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { uploadOnCloudinary } from "../../utils/cloudinary";
import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary";
import { toObjectId } from "../../utils/convertToObjectId";

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video = works
  const { title, description } = req.body;
  const files = req.files as { [k: string]: Express.Multer.File[] };

  if (!title || !description)
    throw new ApiError(400, "TITLE AND DESCRIPTION ARE REQUIRED");
  if (!req.user || !req.user.id) throw new ApiError(400, "USER_ID IS REQUIRED");
  if ([files?.videoFile?.[0], files?.thumbnail?.[0]].some((file) => !file)) {
    throw new ApiError(400, "MEDIA ATTACHMENTS MISSING");
  }

  const videoLocalPath: string = files.videoFile[0].path;
  const thumbnailLocalPath: string = files.thumbnail[0].path;
  const uploadedVideo = await uploadOnCloudinary(videoLocalPath, "videos-fake");
  const uploadedThumbnail = await uploadOnCloudinary(
    thumbnailLocalPath,
    "videos-thumbnails"
  );

  if (!uploadedVideo || !uploadedThumbnail) {
    await deleteFromCloudinary(uploadedVideo?.public_id);
    await deleteFromCloudinary(uploadedThumbnail?.public_id);
    throw new ApiError(400, "ATTACHED MEDIA UPLOAD FAILED");
  }

  const video = await Video.create({
    owner: toObjectId(req.user.id),
    videoFile: uploadedVideo.url,
    videoPublicId: uploadedVideo.public_id,
    thumbnail: uploadedThumbnail.url,
    thumbPublicId: uploadedThumbnail.public_id,
    title,
    description,
    duration: uploadedVideo.duration,
  });
  if (!video) throw new ApiError(400, "VIDEO CREATION FAILED");

  return res
    .status(201)
    .json(new ApiResponse(201, { video }, "VIDEO PUBLISHED SUCCESSFULLY"));
});

export { publishAVideo };
