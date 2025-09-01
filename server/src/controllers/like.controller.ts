import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video

  const { videoId } = req.params;
  let responseMessage = "";
  let resultFindings;

  if (!isValidObjectId(videoId))
    throw new ApiError(400, "OBJECT IN PARAMETER IS NOT VALID");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED USER");

  // searching with videoId and user only give verified document
  const searchLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });
  if (!searchLike) {
    // No like then create like
    const createLike = await Like.create({
      video: videoId,
      likedBy: req.user._id.toString(),
    });
    if (!createLike) throw new ApiError(400, "LIKE CREATION FAILED");
    resultFindings = createLike;
    responseMessage = "LIKE ADDED TO VIDEO";
  } else {
    resultFindings = await Like.findOneAndDelete({
      video: videoId,
      likedBy: req.user._id,
    });
    responseMessage = "LIKE DOCUMENT DELETED";
  }

  console.log("did we found LIKEd ?", searchLike);

  res
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
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "OBJECT IN PARAMETER IS NOT VALID");
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on tweet

  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "OBJECT IN PARAMETER IS NOT VALID");
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
