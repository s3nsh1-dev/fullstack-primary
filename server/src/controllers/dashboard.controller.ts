import mongoose from "mongoose";
import { Video } from "../models/video.model";
import { Subscription } from "../models/subscription.model";
import { Like } from "../models/like.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { toObjectId } from "../utils/convertToObjectId";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  const videos = await Video.aggregate([
    { $match: { owner: toObjectId(req.user._id.toString()) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              avatar: 1,
              username: 1,
              fullname: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        ownerDetails: { $first: "$ownerDetails" },
      },
    },
    {
      $project: {
        _id: 1,
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        ownerDetails: 1,
      },
    },
  ]);
  if (!videos) throw new ApiError(400, "VIDEOS NOT FETCHED");

  return res
    .status(200)
    .json(new ApiResponse(200, { videos }, "VIDEOS FETCHED SUCCESSFULLY"));
});

export { getChannelStats, getChannelVideos };
