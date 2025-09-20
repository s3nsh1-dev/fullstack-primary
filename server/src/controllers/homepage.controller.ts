import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { isValidObjectId } from "mongoose";
import { toObjectId } from "../utils/convertToObjectId";
import { subscribe } from "diagnostics_channel";

const getDetailsForHomepage = asyncHandler(async (req, res) => {
  const { user_ID } = req.params;
  if (!isValidObjectId(user_ID)) throw new ApiError(400, "INVALID USER_ID");

  const user = await User.aggregate([
    { $match: { _id: toObjectId(user_ID) } },
    {
      $lookup: {
        from: "subscriptions",
        as: "subscribers",
        let: { userId: "$_id" },
        pipeline: [
          // RULE: can not user userId without $expr
          { $match: { $expr: { $eq: ["$channel", "$$userId"] } } }, // find who owns the channel
          {
            $lookup: {
              from: "users",
              as: "subscribedUserInformation",
              let: { subscriberId: "$subscriber" },
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$subscriberId"] } } },
                { $project: { avatar: 1, fullname: 1, username: 1 } },
              ],
            },
          },
          { $unwind: "$subscribedUserInformation" }, // array to object
          {
            $addFields: {
              subscriber_id: "$subscriber",
              avatar: "$subscribedUserInformation.avatar",
              fullname: "$subscribedUserInformation.fullname",
              username: "$subscribedUserInformation.username",
              subscribedAt: "$updatedAt",
            },
          },
          {
            // $project forcefully includes only those fields who are mentioned in addFields when preparing subscribers
            $project: {
              subscriber_id: 1,
              avatar: 1,
              fullname: 1,
              username: 1,
              subscribedAt: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "videos",
        as: "videos",
        let: { userId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$owner", "$$userId"] } } },
          {
            $project: {
              title: 1,
              description: 1,
              thumbnail: 1,
              videoFile: 1,
              duration: 1,
              views: 1,
              isPublished: 1,
              createdAt: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "tweets",
        as: "tweets",
        let: { userId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$owner", "$$userId"] } } },
          { $project: { content: 1, createdAt: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: "playlists",
        as: "playlists",
        let: { userId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$owner", "$$userId"] } } },
          { $project: { name: 1, description: 1, videos: 1, createdAt: 1 } },
        ],
      },
    },
    {
      // final API look
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        fullname: 1,
        avatar: 1,
        coverImage: 1,
        createdAt: 1,
        subscribers: 1,
        videos: 1,
        tweets: 1,
        playlists: 1,
      },
    },
  ]);

  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "LOGGED IN USER'S AUTH DETAILS"));
});
export { getDetailsForHomepage };
