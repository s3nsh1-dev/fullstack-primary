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
  //         as: "subscriptions_info",
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
  //         subscriptions_info: 1,
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
                // Now find user based on subscriber
                { $match: { $expr: { $eq: ["$_id", "$$subscriberId"] } } },
                { $project: { avatar: 1, fullname: 1, username: 1 } },
              ],
              as: "subscriber_info",
            },
          },
          { $unwind: "$subscriber_info" },
          {
            $project: {
              _id: 1,
              subscriber: 1,
              "subscriber_info._id": 1,
              "subscriber_info.avatar": 1,
              "subscriber_info.fullname": 1,
              "subscriber_info.username": 1,
            },
          },
        ],
        as: "subscriptions_info",
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
