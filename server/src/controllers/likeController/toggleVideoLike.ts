import { isValidObjectId } from "mongoose";
import { Like } from "../../models/like.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

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
    resultFindings = await Like.deleteOne({
      video: videoId,
      likedBy: req.user._id,
    });
    responseMessage = "LIKE REMOVED FROM VIDEO";
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

export { toggleVideoLike };
