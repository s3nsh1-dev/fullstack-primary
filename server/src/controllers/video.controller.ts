import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { toObjectId } from "../utils/convertToObjectId";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary";
import { isOwner } from "../utils/checkIsOwner";
import { Like } from "../models/like.model";
import { Comment } from "../models/comment.model";

const getAllVideos = asyncHandler(async (req, res) => {
  // TODO: Extract and cast query params safely

  // if (!req.user || !req.user._id)
  //   throw new ApiError(401, "USER_NOT_AUTHENTICATED");
  // const user = await User.findById(req.user._id as string);
  // if (!user) throw new ApiError(404, "USER NOT FOUND");

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

  if (!isValidObjectId(userId)) throw new ApiError(400, "INVALID USER_ID");
  // const matchStage: Record<string, any> = { isPublished: true };
  const matchStage: Record<string, any> = {};

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

  // Count total matching docs (without pagination)
  const totalCount = await Video.countDocuments(matchStage);

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  const videos = await Video.aggregate([
    { $match: matchStage },
    { $sort: sortStage },
    { $skip: (pageNum - 1) * limitNum },
    { $limit: limitNum },
    {
      $project: {
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        isPublished: 1,
        views: 1,
        duration: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalCount,
          totalPages,
        },
      },
      "VIDEOS FETCHED SUCCESSFULLY"
    )
  );
});

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

  return res
    .status(201)
    .json(new ApiResponse(201, { video }, "VIDEO PUBLISHED SUCCESSFULLY"));
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  const { videoId, userId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID USER_ID");

  const fetchedVideo = await Video.findById(videoId).populate(
    "owner",
    "_id fullname avatar username coverImage"
  );
  const isLikedByUser = await Like.exists({
    video: videoId,
    likedBy: userId,
  });
  console.log("userId", userId, isLikedByUser);
  const likesCount = await Like.countDocuments({ video: videoId });

  if (!fetchedVideo) {
    throw new ApiError(404, "VIDEO NOT FOUND");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video: fetchedVideo, isLikedByUser: !!isLikedByUser, likesCount },
        "VIDEO FETCHED SUCCESSFULLY"
      )
    );
});

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

const togglePublishStatus = asyncHandler(async (req, res) => {
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

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID USER_ID");
  if (!req.user || !req.user.id) throw new ApiError(400, "USER_ID IS REQUIRED");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "VIDEO NOT FOUND");

  if (!isOwner(video.owner, req.user.id)) {
    throw new ApiError(403, "NOT AUTHORIZED TO DELETE THIS VIDEO");
  }

  // delete cloudinary files first
  const deletedCloudinaryVideoFile = await deleteFromCloudinary(
    video.videoPublicId
  );
  const deletedCloudinaryThumbnailFile = await deleteFromCloudinary(
    video.thumbPublicId
  );
  if (!deletedCloudinaryVideoFile || !deletedCloudinaryThumbnailFile)
    throw new ApiError(400, "CLOUDINARY FILE DELETION FAILED");

  // ---------- CASCADE DELETE ----------
  // likes directly on video
  await Like.deleteMany({ video: video._id });

  // comments on video
  const comments = await Comment.find({ video: video._id }).select("_id");
  if (comments.length > 0) {
    const commentIds = comments.map((c) => c._id);

    // likes on comments
    await Like.deleteMany({ comment: { $in: commentIds } });

    // subcomments on those comments
    const subComments = await Comment.find({
      comment: { $in: commentIds },
    }).select("_id");
    if (subComments.length > 0) {
      const subCommentIds = subComments.map((c) => c._id);

      // likes on subcomments
      await Like.deleteMany({ comment: { $in: subCommentIds } });

      // delete subcomments
      await Comment.deleteMany({ _id: { $in: subCommentIds } });
    }

    // delete top-level comments
    await Comment.deleteMany({ _id: { $in: commentIds } });
  }
  // ---------- END CASCADE DELETE ----------

  // finally delete video itself
  const result = await video.deleteOne({ _id: videoId });
  if (!result) throw new ApiError(400, "VIDEO DELETION FAILED");

  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "VIDEO DELETED SUCCESSFULLY"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
