import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { toObjectId } from "../utils/convertToObjectId.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";
import { isOwner } from "../utils/checkIsOwner.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
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
  const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

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
  //TODO: update video details like title, description and thumbnail
  const { videoId } = req.params;
  const { title, description } = req.body;
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "VIDEO NOT FOUND");

  if (!req.user || !req.user.id) throw new ApiError(400, "USER_ID IS REQUIRED");
  if (!isOwner(video.owner, req.user.id)) {
    throw new ApiError(403, "NOT AUTHORIZED TO UPDATE THIS VIDEO");
  }

  video.title = title || video.title;
  video.description = description || video.description;

  const files = req.files as { [k: string]: Express.Multer.File[] };
  if (files.thumbnail?.[0]) {
    const newThumbnailLocalPath = files.thumbnail[0].path;
    const uploadedThumbnail = await uploadOnCloudinary(newThumbnailLocalPath);
    if (!uploadedThumbnail) throw new ApiError(400, "THUMBNAIL UPLOAD FAILED");

    await deleteFromCloudinary(video.thumbPublicId);
    video.thumbnail = uploadedThumbnail.url;
    video.thumbPublicId = uploadedThumbnail.public_id;
  }
  const updatedVideo = await video.save({ validateModifiedOnly: true });
  if (!updatedVideo) throw new ApiError(400, "VIDEO UPDATE FAILED");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video: updatedVideo },
        "VIDEO DETAILS UPDATED SUCCESSFULLY"
      )
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "VIDEO NOT FOUND");

  if (!req.user || !req.user.id) throw new ApiError(400, "USER_ID IS REQUIRED");
  if (!isOwner(video.owner, req.user.id)) {
    throw new ApiError(403, "NOT AUTHORIZED TO DELETE THIS VIDEO");
  }

  const deletedCloudinaryVideoFile = await deleteFromCloudinary(
    video.videoPublicId
  );
  const deletedCloudinaryThumbnailFile = await deleteFromCloudinary(
    video.thumbPublicId
  );
  if (!deletedCloudinaryVideoFile || !deletedCloudinaryThumbnailFile)
    throw new ApiError(400, "CLOUDINARY FILE DELETION FAILED");

  const deletedVideoFile = await video.deleteOne({ _id: videoId });
  if (!deletedVideoFile) throw new ApiError(400, "VIDEO DELETION FAILED");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result: deletedVideoFile },
        "VIDEO DELETED SUCCESSFULLY"
      )
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(404, "VIDEO NOT FOUND");
  if (!req.user || !req.user.id) throw new ApiError(400, "USER_ID IS REQUIRED");
  if (!isOwner(video.owner, req.user.id))
    throw new ApiError(403, "NOT AUTHORIZED TO TOGGLE THIS VIDEO");

  video.isPublished = !video.isPublished;
  const updatedVideo = await video.save({ validateModifiedOnly: true });
  if (!updatedVideo)
    throw new ApiError(400, "VIDEO PUBLISHED STATUS UNCHANGED");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video: updatedVideo },
        "VIDEO PUBLISH STATUS TOGGLED SUCCESSFULLY"
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};

/*
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "INVALID VIDEO ID");
  }
  
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "VIDEO NOT FOUND");
  
  // Check ownership
  if (video.owner.toString() !== req.user.id) {
    throw new ApiError(403, "NOT AUTHORIZED TO UPDATE THIS VIDEO");
  }
  
  const { title, description } = req.body;
  
  // Handle thumbnail upload
  let newThumbnailUrl = video.thumbnail;
  if (req.file) {
    const uploadedThumb = await uploadOnCloudinary(req.file.path);
    if (!uploadedThumb) throw new ApiError(400, "THUMBNAIL UPLOAD FAILED");
    newThumbnailUrl = uploadedThumb.url;
  }

  video.title = title || video.title;
  video.description = description || video.description;
  video.thumbnail = newThumbnailUrl;
  
  const updatedVideo = await video.save({ validateModifiedOnly: true });
  
  res
  .status(200)
  .json(
    new ApiResponse(
      200,
      { video: updatedVideo },
      "VIDEO UPDATED SUCCESSFULLY"
    )
  );
});
*/
/*
const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = "1",
    limit = "10",
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query as Record<string, string>;

  const pipeline: any[] = [];

  // filter by owner (optional)
  if (userId) pipeline.push({ $match: { owner: toObjectId(userId) } });

  // text-ish search on title/description (simple regex)
  if (query && query.trim()) {
    const rx = new RegExp(query.trim(), "i");
    pipeline.push({
      $match: { $or: [{ title: rx }, { description: rx }] },
    });
  }

  // only published for public listing
  pipeline.push({ $match: { isPublished: true } });

  // enrich with owner (display info)
  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { username: 1, avatar: 1 } }],
      },
    },
    { $unwind: "$owner" }
  );

  const sortDir = sortType === "asc" ? 1 : -1;
  pipeline.push({ $sort: { [sortBy]: sortDir } });

  const options = {
    page: Number(page),
    limit: Number(limit),
    customLabels: {
      totalDocs: "total",
      docs: "videos",
    },
  };

  // @ts-ignore (plugin typing is loose)
  const result = await (Video as any).aggregatePaginate(
    Video.aggregate(pipeline),
    options
  );

  return res.status(200).json(new ApiResponse(200, result, "VIDEOS LISTED"));
});

*/
/*
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID VIDEO ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "VIDEO NOT FOUND");
  if (!isOwner(video.owner, req.user!._id))
    throw new ApiError(403, "FORBIDDEN");

  const { title, description } = req.body;

  if (req.file) {
    const upThumb = await uploadOnCloudinary(req.file.path);
    if (!upThumb) throw new ApiError(400, "THUMBNAIL UPLOAD FAILED");
    // await deleteFromCloudinary(video.thumbPublicId); // if you store it
    video.thumbnail = upThumb.url;
    // video.thumbPublicId = upThumb.public_id;
  }

  if (title) video.title = title;
  if (description) video.description = description;
  
  const updated = await video.save({ validateModifiedOnly: true });
  
  return res
  .status(200)
    .json(new ApiResponse(200, { video: updated }, "VIDEO UPDATED"));
});
*/
/*
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID VIDEO ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "VIDEO NOT FOUND");
  if (!isOwner(video.owner, req.user!._id)) throw new ApiError(403, "FORBIDDEN");

  // await deleteFromCloudinary(video.videoPublicId);
  // await deleteFromCloudinary(video.thumbPublicId);
  await video.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, "VIDEO DELETED"));
});

*/
/*
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID VIDEO ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "VIDEO NOT FOUND");
  if (!isOwner(video.owner, req.user!._id)) throw new ApiError(403, "FORBIDDEN");

  video.isPublished = !video.isPublished;
  await video.save({ validateModifiedOnly: true });

  return res
    .status(200)
    .json(new ApiResponse(200, { isPublished: video.isPublished }, "STATUS TOGGLED"));
});

*/
/*
LOOK INTO THIS:
videoSchema.index({ title: "text", description: "text" });
videoSchema.index({ owner: 1, createdAt: -1 });
*/
