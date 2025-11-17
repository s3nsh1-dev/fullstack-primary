import { User } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

const getWatchHistory = asyncHandler(async (req, res) => {
  //TODO: get watchHistory for a user
  if (!req.user || !req.user?._id) {
    throw new ApiError(401, "UNAUTHENTICATED USER");
  }
  const userId = req.user._id;

  const userWatchHistory = await User.findById(userId)
    .select("watchHistory")
    .populate({
      path: "watchHistory",
      select:
        "owner title description videoFile thumbnail views duration isPublished updatedAt createdAt",
      populate: { path: "owner", select: "fullname username avatar" },
    });
  if (!userWatchHistory) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, userWatchHistory, "Watch history fetched"));
});

export { getWatchHistory };
