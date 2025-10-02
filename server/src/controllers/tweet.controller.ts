import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { toObjectId } from "../utils/convertToObjectId";
import { Comment } from "../models/comment.model";
import { isOwner } from "../utils/checkIsOwner";
import { Like } from "../models/like.model";

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

  const tweets = await Tweet.find({ owner: toObjectId(userId) }).populate({
    path: "owner",
    select: "username fullname avatar",
  });
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
  if (!content) throw new ApiError(400, "CONTENT NOT FOUND");

  const updatedTweet = await Tweet.aggregate([
    { $match: { _id: toObjectId(tweetId) } },
    { $set: { content } },
    {
      $merge: {
        into: "tweets",
        on: "_id",
        whenMatched: "merge",
        whenNotMatched: "discard",
      },
    },
  ]);

  if (!updatedTweet) throw new ApiError(404, "TWEET NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { tweet: updatedTweet[0] },
        "TWEET UPDATED SUCCESSFULLY"
      )
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId) throw new ApiError(400, "TWEET_ID NOT FOUND");
  if (!req.user || !req.user._id) {
    throw new ApiError(400, "USER NOT AUTHENTICATED");
  }

  const tweet = await Tweet.findById(tweetId).populate("owner", "_id");
  if (!tweet) throw new ApiError(404, "TWEET NOT FOUND");

  if (!isOwner(tweet.owner._id, req.user._id.toString())) {
    throw new ApiError(403, "NOT AUTHORIZED TO DELETE TWEET");
  }

  // Delete likes on the tweet
  await Like.deleteMany({ tweet: tweet._id });

  // Find all comments linked to this tweet
  const comments = await Comment.find({ tweet: tweet._id }).select("_id");

  if (comments.length > 0) {
    const commentIds = comments.map((c) => c._id);

    // Delete likes on comments
    await Like.deleteMany({ comment: { $in: commentIds } });

    // Find all subcomments tied to those comments
    const subComments = await Comment.find({
      comment: { $in: commentIds },
    }).select("_id");
    if (subComments.length > 0) {
      const subCommentIds = subComments.map((c) => c._id);

      // Delete likes on subcomments
      await Like.deleteMany({ comment: { $in: subCommentIds } });

      // Delete subcomments
      await Comment.deleteMany({ _id: { $in: subCommentIds } });
    }

    // Delete comments
    await Comment.deleteMany({ _id: { $in: commentIds } });
  }

  // Finally delete the tweet
  const result = await tweet.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "TWEET DELETED SUCCESSFULLY"));
});

const fetchTweet = asyncHandler(async (req, res) => {
  //TODO: get tweet

  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) throw new ApiError(400, "INVALID TWEET_ID");

  const tweet = await Tweet.findById(tweetId).populate({
    path: "owner",
    select: "username fullname avatar email coverImage",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "TWEET RETRIEVED SUCCESSFULLY"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet, fetchTweet };
