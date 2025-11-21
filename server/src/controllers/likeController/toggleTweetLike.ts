import { isValidObjectId } from "mongoose";
import { Like } from "../../models/like.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

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
    resultFindings = await Like.deleteOne({
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

export { toggleTweetLike };
