import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { Video } from "../models/video.model";
import { Tweet } from "../models/tweet.model";
import { toObjectId } from "../utils/convertToObjectId";
import { isValidObjectId } from "mongoose";

const searchingText = asyncHandler(async (req, res) => {
  const { searchText } = req.params;
  const { userId } = req.query;

  if (!searchText || searchText.trim().length < 1)
    throw new ApiError(400, "Search text must be at least 1 character long");

  const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  // Run all queries in parallel
  const [searchUser, searchVideo, searchTweet] = await Promise.all([
    User.find({
      $or: [{ username: regex }, { fullname: regex }],
    }).select("username fullname avatar email createdAt"),
    Video.find({ title: regex }).populate("owner", "username fullname avatar"),
    Tweet.aggregate([
      { $match: { content: regex } },
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
                    { $eq: ["$likedBy", toObjectId(userId as string)] },
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
    ]),
  ]);

  // If all are empty, return no matches message
  if (
    searchUser.length === 0 &&
    searchVideo.length === 0 &&
    searchTweet.length === 0
  ) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { result: "No matching content found" },
          "Search results fetched successfully"
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: searchUser, video: searchVideo, tweet: searchTweet },
        "Search results fetched successfully"
      )
    );
});

export { searchingText };
