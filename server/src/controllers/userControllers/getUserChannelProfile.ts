import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";
import { isValidObjectId } from "mongoose";
import { toObjectId } from "../../utils/convertToObjectId";

export const getUserChannelProfile = asyncHandler(async (req, res) => {
  const username = req.params.username as string;
  const adminId = req.query.adminId as string;

  if (!username || !adminId || !username.trim() || !isValidObjectId(adminId)) {
    throw new ApiError(404, "INVALID QUERY PARAMETER");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username.trim(),
        isDeactivated: { $ne: true },
        isSuspended: { $ne: true },
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "mySub",
        pipeline: [{ $project: { _id: 1 } }],
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "meSubbing",
        pipeline: [{ $project: { _id: 1 } }],
      },
    },
    ...(adminId && isValidObjectId(adminId)
      ? [
          {
            $lookup: {
              from: "subscriptions",
              let: { ownerId: "$_id" },
              as: "checkSub",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$channel", "$$ownerId"] },
                        { $eq: ["$subscriber", toObjectId(adminId as string)] },
                      ],
                    },
                  },
                },
              ],
            },
          },
        ]
      : []),
    {
      $addFields: {
        mySubCount: { $size: "$mySub" },
        meSubbingCount: { $size: "$meSubbing" },
        isSubbed: {
          $cond: {
            if: { $gt: [{ $size: { $ifNull: ["$checkSub", []] } }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        mySubCount: 1,
        meSubbingCount: 1,
        isSubbed: 1,
      },
    },
  ]);

  if (!channel || channel.length === 0) {
    throw new ApiError(400, "CHANNEL DOES NOT EXIST");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: channel[0] },
        "USER CHANNEL FETCHED SUCCESSFULLY"
      )
    );
});
