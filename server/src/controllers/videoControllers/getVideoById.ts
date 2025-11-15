import { isValidObjectId } from "mongoose";
import { Video } from "../../models/video.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { Like } from "../../models/like.model";

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  const { videoId } = req.params;
  const { userId } = req.query;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID USER_ID");

  const fetchedVideo = await Video.findById(videoId).populate(
    "owner",
    "_id fullname avatar username coverImage"
  );
  let isLikedByUser = false;
  if (isValidObjectId(userId)) {
    const check = await Like.exists({
      video: videoId,
      likedBy: userId,
    });
    isLikedByUser = check ? true : false;
  }

  const likesCount = await Like.countDocuments({ video: videoId });

  if (!fetchedVideo) {
    throw new ApiError(404, "VIDEO NOT FOUND");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video: fetchedVideo, isLikedByUser: !!isLikedByUser, likesCount },
        "VIDEO FETCHED SUCCESSFULLY"
      )
    );
});

export { getVideoById };
