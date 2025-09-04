import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { toObjectId } from "../utils/convertToObjectId";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "USER NOT VERIFIED");
  }

  const tweet = await Tweet.create({
    owner: toObjectId(req.user._id as string),
    content,
  });
  if (!tweet) {
    throw new ApiError(400, "TWEET CREATION FAILED");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, { tweet }, "NEW TWEET CREATED"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  const { userId } = req.params;
  if (!isValidObjectId(userId)) throw new ApiError(400, "INVALID USER_ID");

  const tweets = await Tweet.find({ owner: toObjectId(userId) });
  if (!tweets) {
    throw new ApiError(404, "TWEETS NOT FOUND");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { tweets }, "USER TWEETS RETRIEVED"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { content } = req.body;
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) throw new ApiError(400, "INVALID TWEET_ID");

  const tweet = await Tweet.aggregate([
    { $match: { _id: toObjectId(tweetId) } },
    { $set: { content } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              id: 1,
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        ownerDetails: { $first: "$ownerDetails" },
      },
    },
  ]);
  if (!tweet) throw new ApiError(404, "TWEET NOT FOUND");

  return res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "TWEET UPDATED SUCCESSFULLY"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet

  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) throw new ApiError(400, "INVALID USER_ID");

  const tweet = await Tweet.findByIdAndDelete(tweetId);
  if (!tweet) {
    throw new ApiError(404, "TWEET NOT FOUND");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "TWEET DELETED SUCCESSFULLY"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
