import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model";
import { User } from "../models/user.model";
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
  res.status(201).json(new ApiResponse(201, { tweet }, "NEW TWEET CREATED"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "INVALID USER ID");
  }
  const tweets = await Tweet.find({ owner: toObjectId(userId) });
  if (!tweets) {
    throw new ApiError(404, "TWEETS NOT FOUND");
  }
  res
    .status(200)
    .json(new ApiResponse(200, { tweets }, "USER TWEETS RETRIEVED"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { content } = req.body;
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "INVALID TWEET ID");
  }

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $set: { content } },
    { new: true }
  );
  if (!tweet) {
    throw new ApiError(404, "TWEET NOT FOUND");
  }
  res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "TWEET UPDATED SUCCESSFULLY"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  const tweet = await Tweet.findByIdAndDelete(tweetId);
  if (!tweet) {
    throw new ApiError(404, "TWEET NOT FOUND");
  }
  res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "TWEET DELETED SUCCESSFULLY"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
