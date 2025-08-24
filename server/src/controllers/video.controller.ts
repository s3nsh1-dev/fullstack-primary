import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { toObjectId } from "../utils/convertToObjectId.js";
import { isOwner } from "../utils/checkIsOwner.js";

// const getAllVideos = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
//   //TODO: get all videos based on query, sort, pagination
// });

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

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  const { title, description } = req.body;
  if (!title || !description)
    throw new ApiError(400, "TITLE AND DESCRIPTION ARE REQUIRED");

  if (!req.user || !req.user._id)
    throw new ApiError(400, "USER_ID IS REQUIRED");

  const files = req.files as { [k: string]: Express.Multer.File[] };
  if (!files?.videoFile?.[0]) throw new ApiError(400, "VIDEO FILE IS REQUIRED");
  if (!files?.thumbnail?.[0])
    throw new ApiError(400, "THUMBNAIL FILE IS REQUIRED");

  const videoLocalPath: string = files.videoFile[0].path;
  const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
  if (!uploadedVideo) throw new ApiError(400, "VIDEO UPLOAD FAILED");

  let thumbnailLocalPath: string = "";
  if (Array.isArray(files.thumbnail) && files.thumbnail.length > 0) {
    thumbnailLocalPath = files.thumbnail[0].path;
  }
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!uploadedThumbnail) throw new ApiError(400, "THUMBNAIL UPLOAD FAILED");

  const video = await Video.create({
    videoFile: uploadedVideo.url,
    thumbnail: uploadedThumbnail.url,
    owner: toObjectId(req.user.id),
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

// const updateVideo = asyncHandler(async (req, res) => {
//   const { videoId } = req.params;
//   //TODO: update video details like title, description, thumbnail
// });

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID VIDEO ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "VIDEO NOT FOUND");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "USER_ID IS REQUIRED");

  if (!isOwner(video.owner, req.user._id)) throw new ApiError(403, "FORBIDDEN");

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
