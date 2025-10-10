import { Video } from "../models/video.model";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const getWatchHistory = asyncHandler(async (req, res) => {
  //TODO: get watchHistory for a user
  const { userId } = req.params;
  const userWatchHistory = await User.findById(userId);
  if (!userWatchHistory) throw new ApiError(404, "User not found");
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { history: userWatchHistory },
        "Watch history fetched"
      )
    );
});

const addToWatchHistory = asyncHandler(async (req, res) => {
  //TODO: add watchHistory in user document
});

export { addToWatchHistory, getWatchHistory };
