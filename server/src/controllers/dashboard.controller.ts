import mongoose from "mongoose";
import { Video } from "../models/video.model";
import { Subscription } from "../models/subscription.model";
import { Like } from "../models/like.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { toObjectId } from "../utils/convertToObjectId";

type Stats = {
  [key: string]: string;
  // Record<string, number>
};

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  const user_ID = req.user._id;
  const stats: Stats = {};
  let totalViews = 0;

  const totalVideos = await Video.find({ owner: user_ID });
  if (!totalVideos) throw new ApiError(400, "ERROR WHILE FETCHING THE VIDEOS");
  totalVideos.forEach((item) => {
    console.log(item.title);
    totalViews += item.views;
  });

  const subscribers = await Subscription.find({ channel: user_ID });
  if (!subscribers) throw new ApiError(400, "CHANNEL NOT FOUND");

  const likes = await Like.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              title: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "tweetDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              content: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    { $unwind: { path: "$videoDetails", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$tweetDetails", preserveNullAndEmptyArrays: true } },
    {
      $match: {
        $or: [
          { "videoDetails.owner": user_ID },
          { "tweetDetails.owner": user_ID },
        ],
      },
    },
    // {
    //   $project: {
    //     _id: 1,
    //     likedBy: 1,
    //     videoDetails: 1,
    //     tweetDetails: 1,
    //   },
    // },
  ]);

  stats["totalViews"] = totalViews.toString();
  stats["totalSubscribers"] = subscribers.length.toString();
  stats["uploadedVideoCount"] = totalVideos.length.toString();

  console.log(stats);
  return res
    .status(200)
    .json(new ApiResponse(200, { result: likes }, "HERE IS YOUR RESULT"));
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
