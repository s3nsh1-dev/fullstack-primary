import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { Video } from "../models/video.model";
import { Tweet } from "../models/tweet.model";
import { toObjectId } from "../utils/convertToObjectId";
import { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model";

const searchingText = asyncHandler(async (req, res) => {
  const searchText = String(req.params.searchText);
  const userId = String(req.query.userId);

  if (!searchText || searchText.trim().length < 1) {
    throw new ApiError(400, "Search text must be at least 1 character long");
  }

  const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  const [searchUser, searchVideo, searchTweet, searchPlaylist] =
    await Promise.all([
      User.find({
        $or: [{ username: regex }, { fullname: regex }],
        isDeactivated: false,
        isSuspended: false,
      }).select("username fullname avatar email createdAt"),
      Video.aggregate([
        {
          $match: {
            isPublished: true,
            $or: [{ title: regex }, { description: regex }],
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
              { $match: { isDeactivated: false, isSuspended: false } },
              { $project: { username: 1, fullname: 1, avatar: 1 } },
            ],
          },
        },
        { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        { $match: { owner: { $exists: true, $ne: null } } },
      ]),
      Tweet.aggregate([
        { $match: { content: regex } },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
              { $match: { isDeactivated: false, isSuspended: false } },
              { $project: { username: 1, fullname: 1, avatar: 1 } },
            ],
          },
        },
        { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        { $match: { owner: { $exists: true, $ne: null } } },
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
                      {
                        $eq: [
                          "$likedBy",
                          isValidObjectId(userId)
                            ? toObjectId(userId as string)
                            : null,
                        ],
                      },
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
      Playlist.aggregate([
        {
          $match: {
            $or: [{ name: regex }, { description: regex }],
          },
        },
      ]),
    ]);

  if (
    searchUser.length === 0 &&
    searchVideo.length === 0 &&
    searchTweet.length === 0
    // && searchPlaylist.length === 0
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

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: searchUser,
        video: searchVideo,
        tweet: searchTweet,
        playlist: searchPlaylist,
      },
      "Search results fetched successfully"
    )
  );
});

export { searchingText };
