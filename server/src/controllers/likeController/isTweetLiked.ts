import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../../models/like.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

const isTweetLiked = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) throw new ApiError(400, "INVALID TWEET ID");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  const isTweetLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        isTweetLiked ? true : false,
        "TWEET IS LIKED SUCCESSFULLY"
      )
    );
});
export { isTweetLiked };
