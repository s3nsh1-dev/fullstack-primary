import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../../models/like.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { isOwner } from "../../utils/checkIsOwner";

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
    resultFindings = await Like.deleteOne({
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

export { toggleCommentLike };
