import { isValidObjectId } from "mongoose";
import { Tweet } from "../../models/tweet.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { toObjectId } from "../../utils/convertToObjectId";

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  const { userId } = req.params;
  if (!isValidObjectId(userId)) throw new ApiError(400, "INVALID USER_ID");

  const foo = await Tweet.aggregate([
    { $match: { owner: toObjectId(userId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { username: 1, fullname: 1, avatar: 1 } }],
      },
    },
    {
      $lookup: {
        from: "likes",
        let: { tweetId: "$_id" }, // this is tweet_id fetched during execution
        as: "likedDetails",
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$tweet", "$$tweetId"] },
                  { $eq: ["$likedBy", toObjectId(userId)] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
      },
    },
    {
      $addFields: {
        isLiked: {
          $cond: [{ $gt: [{ $size: "$likedDetails" }, 0] }, true, false],
        },
      },
    },

    { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        content: 1,
        owner: 1,
        createdAt: 1,
        updatedAt: 1,
        isLiked: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { tweets: foo }, "USER TWEETS RETRIEVED"));
});

export { getUserTweets };
