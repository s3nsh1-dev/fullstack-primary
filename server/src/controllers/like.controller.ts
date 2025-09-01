import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { isOwner } from "../utils/checkIsOwner";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video

  const { videoId } = req.params;
  let responseMessage = "";
  let resultFindings;

  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID VIDEO_ID");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  // searching with videoId and user only give verified document
  const searchVideoLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });
  if (!searchVideoLike) {
    // No like then create like
    const createVideoLike = await Like.create({
      video: videoId,
      likedBy: req.user._id.toString(),
    });
    if (!createVideoLike) throw new ApiError(400, "FAILED TO CREATE LIKE");
    resultFindings = createVideoLike;
    responseMessage = "LIKE ADDED TO VIDEO";
  } else {
    resultFindings = await Like.findOneAndDelete({
      video: videoId,
      likedBy: req.user._id,
    });
    responseMessage = "LIKE REMOVED FROM VIDEO";
  }

  console.log("did we found LIKEd ?", searchVideoLike);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result: resultFindings },
        `${responseMessage} SUCCESSFULLY`
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on comment

  const { commentId } = req.params;
  let responseMessage = "";
  let resultFindings;
  if (!isValidObjectId(commentId))
    throw new ApiError(400, "INVALID COMMENT ID");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  // double verification for loggedIn user <INTENTIONAL>
  const searchCommentLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });
  if (!searchCommentLike) {
    // No like then create like
    const createCommentLike = await Like.create({
      comment: commentId,
      likedBy: req.user._id.toString(),
    });
    if (!createCommentLike) throw new ApiError(400, "FAILED TO CREATE LIKE");
    resultFindings = createCommentLike;
    responseMessage = "LIKE ADDED TO COMMENT";
  } else {
    if (!isOwner(searchCommentLike.likedBy, req.user._id.toString())) {
      throw new ApiError(400, "USER NOT AUTHORIZED TO MAKE CHANGES");
    }
    resultFindings = await Like.findOneAndDelete({
      comment: commentId,
      likedBy: req.user._id,
    });
    responseMessage = "LIKE REMOVED FROM COMMENT";
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result: resultFindings },
        `${responseMessage} SUCCESSFULLY`
      )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on tweet

  const { tweetId } = req.params;
  let responseMessage = "";
  let resultFindings;

  if (!isValidObjectId(tweetId)) throw new ApiError(400, "INVALID TWEET ID");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  const searchTweetLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });
  if (!searchTweetLike) {
    // No like then create like
    const createTweetLike = await Like.create({
      tweet: tweetId,
      likedBy: req.user._id.toString(),
    });
    if (!createTweetLike) throw new ApiError(400, "FAILED TO CREATE LIKE");
    resultFindings = createTweetLike;
    responseMessage = "LIKE ADDED TO TWEET";
  } else {
    resultFindings = await Like.findOneAndDelete({
      tweet: tweetId,
      likedBy: req.user._id,
    });
    responseMessage = "LIKE REMOVED FROM TWEET";
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result: resultFindings },
        `${responseMessage} SUCCESSFULLY`
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
