import { User } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { isValidObjectId } from "mongoose";
import { toObjectId } from "../../utils/convertToObjectId";

const addToWatchHistory = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");
  if (!isValidObjectId(userId))
    return res
      .status(200)
      .json(new ApiResponse(200, { result: false }, "USER NOT LOGGED IN"));

  await User.findByIdAndUpdate(userId, {
    $pull: { watchHistory: toObjectId(videoId) },
  });

  await User.findByIdAndUpdate(userId, {
    $push: {
      watchHistory: {
        $each: [toObjectId(videoId)],
        $position: 0,
        $slice: 50,
      },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, true, "Video added to watch history"));
});

export { addToWatchHistory };
