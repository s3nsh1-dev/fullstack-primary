import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  const { title, description } = req.body;
  if (!title || !description)
    throw new ApiError(400, "TITLE AND DESCRIPTION ARE REQUIRED");
  if (!req.file) throw new ApiError(400, "VIDEO FILE IS REQUIRED");
  if (!req.user || !req.user.id) throw new ApiError(400, "USER_ID IS REQUIRED");

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const videoLocalPath: string = files.videoFile[0].path;
  const checkVideoCloudinaryUpload = await uploadOnCloudinary(videoLocalPath);
  if (!checkVideoCloudinaryUpload)
    throw new ApiError(400, "VIDEO UPLOAD FAILED");

  let thumbnailLocalPath: string = "";
  if (Array.isArray(files.thumbnail) && files.thumbnail.length > 0) {
    thumbnailLocalPath = files.thumbnail[0].path;
  }
  const checkThumbnailCloudinaryUpload =
    await uploadOnCloudinary(thumbnailLocalPath);
  if (!checkThumbnailCloudinaryUpload)
    throw new ApiError(400, "THUMBNAIL UPLOAD FAILED");

  /*
    const video = new Video({
      title,
      description,
      user: req.user.id,
    });
    video.videoUrl = uploadedVideo.secure_url;
    await video.save();
  */

  const video = await Video.create({
    videoFile: checkVideoCloudinaryUpload.url,
    thumbnail: checkThumbnailCloudinaryUpload.url,
    owner: new mongoose.Types.ObjectId(String(req.user.id)),
    title,
    description,
    duration: 0,
  });
  if (!video) throw new ApiError(400, "VIDEO CREATION FAILED");

  res
    .status(201)
    .json(new ApiResponse(201, { video }, "VIDEO PUBLISHED SUCCESSFULLY"));
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  const { videoId } = req.params;
  if (!videoId || !videoId.toString()) {
    throw new ApiError(400, "VIDEO_ID NOT FOUND");
  }

  const fetchedVideo = await Video.findById(videoId);
  if (!fetchedVideo) {
    throw new ApiError(404, "VIDEO NOT FOUND");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video: fetchedVideo },
        "VIDEO FETCHED SUCCESSFULLY"
      )
    );
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
