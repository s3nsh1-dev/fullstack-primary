// import { Video } from "../models/video.model";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import mongoose, { isValidObjectId } from "mongoose";
import { toObjectId } from "../utils/convertToObjectId";

const getWatchHistory = asyncHandler(async (req, res) => {
  //TODO: get watchHistory for a user
  if (!req.user || !req.user?._id) {
    throw new ApiError(401, "UNAUTHENTICATED USER");
  }
  const userId = req.user._id;

  const userWatchHistory = await User.findById(userId)
    .select("watchHistory")
    .populate({
      path: "watchHistory",
      select:
        "owner title description videoFile thumbnail views duration isPublished updatedAt createdAt",
      populate: { path: "owner", select: "fullname username avatar" },
    }); // Populate uploader's username and avatar
  if (!userWatchHistory) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, userWatchHistory, "Watch history fetched"));
});

const addToWatchHistory = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");
  if (!isValidObjectId(userId))
    return res
      .status(200)
      .json(new ApiResponse(200, { result: false }, "USER NOT LOGGED IN"));

  await User.findByIdAndUpdate(userId, {
    $pull: { watchHistory: toObjectId(videoId) },
  });

  await User.findByIdAndUpdate(userId, {
    $push: {
      watchHistory: {
        $each: [toObjectId(videoId)],
        $position: 0,
        $slice: 50,
      },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, true, "Video added to watch history"));
});

export { addToWatchHistory, getWatchHistory };
