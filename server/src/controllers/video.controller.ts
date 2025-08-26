import mongoose from "mongoose";
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
  // TODO: Extract and cast query params safely
  const {
    page = "1",
    limit = "10",
    query,
    sortBy,
    sortType,
    userId,
  } = req.query as {
    page?: string;
    limit?: string;
    query?: string;
    sortBy?: string;
    sortType?: string;
    userId?: string;
  };

  const matchStage: Record<string, any> = { isPublished: true };

  if (query) {
    matchStage.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (userId) {
    matchStage.owner = new mongoose.Types.ObjectId(userId);
  }

  // Sorting
  const sortStage: Record<string, 1 | -1> = {};
  const sortField = sortBy && sortBy.length > 0 ? sortBy : "createdAt";
  sortStage[sortField] = sortType === "asc" ? 1 : -1;

  // Pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const videos = await Video.aggregate([
    { $match: matchStage },
    { $sort: sortStage },
    { $skip: (pageNum - 1) * limitNum },
    { $limit: limitNum },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        duration: 1,
        createdAt: 1,
        "ownerDetails.username": 1,
        "ownerDetails.avatar": 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, { videos }, "VIDEOS FETCHED SUCCESSFULLY"));
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

const getAllVideoOfUser = asyncHandler(async (req, res) => {
  // TODO: ADMIN PANEL AS NON PUBLISHED VIDEO WILL ALSO BE SHOWN
  const { userId } = req.params;
  if (!userId) throw new ApiError(400, "USER_ID IS REQUIRED");

  const videos = await Video.find({ owner: userId as string }).sort({
    createdAt: -1,
  });
  if (!videos) {
    return res.status(404).json(new ApiResponse(404, null, "NO VIDEOS FOUND"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, { videos }, "VIDEOS FETCHED SUCCESSFULLY"));
});

const getVideosForFeed = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);

  const videos = await Video.aggregate([
    // 1️⃣ Only published
    { $match: { isPublished: true } },

    // 2️⃣ Sort newest first
    { $sort: { createdAt: -1 } },

    // 3️⃣ Pagination
    { $skip: (pageNum - 1) * limitNum },
    { $limit: limitNum },

    // 4️⃣ Join with users collection to get owner details
    {
      $lookup: {
        from: "users", // Mongo auto pluralizes your model
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },

    // 5️⃣ Only send required fields
    {
      $project: {
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        duration: 1,
        createdAt: 1,
        "ownerDetails.username": 1,
        "ownerDetails.avatar": 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, { videos }, "VIDEOS FETCHED SUCCESSFULLY"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getAllVideoOfUser,
  getVideosForFeed,
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
