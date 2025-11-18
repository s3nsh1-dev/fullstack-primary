import { isValidObjectId } from "mongoose";
import { Like } from "../../models/like.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

const isVideoLiked = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID VIDEO ID");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  const isVideoLiked = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        isVideoLiked ? true : false,
        "VIDEO IS LIKED SUCCESSFULLY"
      )
    );
});

export { isVideoLiked };
