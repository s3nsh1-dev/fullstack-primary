import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { isValidObjectId } from "mongoose";
import { toObjectId } from "../utils/convertToObjectId";

const getDetailsForHomepage = asyncHandler(async (req, res) => {
  const { user_ID } = req.params;
  if (!isValidObjectId(user_ID)) throw new ApiError(400, "INVALID USER_ID");

  //   const user = await User.aggregate([
  //     { $match: { _id: toObjectId(user_ID) } },
  //     {
  //       $lookup: {
  //         from: "subscriptions",
  //         let: { userId: "$_id" },
  //         pipeline: [
  //           { $match: { $expr: { $eq: ["$channel", "$$userId"] } } },
  //           { $project: { _id: 1, subscriber: 1 } },
  //         ],
  //         as: "subscribers_info",
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         username: 1,
  //         email: 1,
  //         fullname: 1,
  //         avatar: 1,
  //         coverImage: 1,
  //         createdAt: 1,
  //         subscribers_info: 1,
  //       },
  //     },
  //   ]);
  const user = await User.aggregate([
    { $match: { _id: toObjectId(user_ID) } },
    {
      $lookup: {
        from: "subscriptions",
        let: { userId: "$_id" },
        pipeline: [
          // RULE: can not user userId without $expr
          { $match: { $expr: { $eq: ["$channel", "$$userId"] } } }, // find who owns the channel
          {
            $lookup: {
              from: "users",
              let: { subscriberId: "$subscriber" },
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$subscriberId"] } } },
                { $project: { _id: 1, avatar: 1, fullname: 1, username: 1 } },
              ],
              as: "subscriber_info",
            },
          },
          { $unwind: "$subscriber_info" },
          {
            $addFields: {
              subscriber: "$subscriber_info._id",
              avatar: "$subscriber_info.avatar",
              fullname: "$subscriber_info.fullname",
              username: "$subscriber_info.username",
            },
          },
          { $project: { id: 1, avatar: 1, fullname: 1, username: 1 } },
        ],
        as: "subscribers_info",
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        fullname: 1,
        avatar: 1,
        coverImage: 1,
        createdAt: 1,
        subscribers_info: 1,
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
