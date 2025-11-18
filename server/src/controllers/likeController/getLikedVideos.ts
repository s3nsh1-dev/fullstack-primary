import mongoose from "mongoose";
import { Like } from "../../models/like.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHORIZED REQUEST");

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id.toString()),
        video: { $exists: true },
      },
    },
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
              description: 1,
              thumbnail: 1,
              duration: 1,
              views: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$videoDetails",
    },
    {
      $lookup: {
        from: "users",
        localField: "videoDetails.owner",
        foreignField: "_id",
        as: "videoOwner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    // {
    //   $addFields: {
    //     videoOwner: { $first: "$videoOwner" },
    //   },
    // },
    {
      $unwind: "$videoOwner",
    },
    {
      $project: {
        _id: 1,
        video: 1,
        likedBy: 1,
        videoDetails: 1,
        videoOwner: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!likedVideos) throw new ApiError(404, "LIKES NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes: likedVideos, length: likedVideos.length },
        "USER LIKED VIDEOS FETCHED SUCCESSFULLY"
      )
    );
});

export { getLikedVideos };
