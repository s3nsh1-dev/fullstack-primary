import { isValidObjectId } from "mongoose";
import { Like } from "../../models/like.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

const isCommentLiked = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId))
    throw new ApiError(400, "INVALID COMMENT ID");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  const isCommentLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        isCommentLiked ? true : false,
        "COMMENT IS LIKED SUCCESSFULLY"
      )
    );
});

export { isCommentLiked };
