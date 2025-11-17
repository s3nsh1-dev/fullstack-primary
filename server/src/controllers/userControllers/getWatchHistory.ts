import { User } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { Video } from "../../models/video.model";

const getWatchHistory = asyncHandler(async (req, res) => {
  //TODO: get watchHistory for a user
  if (!req.user || !req.user?._id) {
    throw new ApiError(401, "UNAUTHENTICATED USER");
  }
  const userId = req.user._id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const user = await User.findById(userId).select("watchHistory");

  // slice BEFORE populate
  const start = (page - 1) * limit;
  const end = start + limit;
  const slicedIds = user.watchHistory.slice(start, end);

  // populate sliced ids only
  const videos = await Video.find({ _id: { $in: slicedIds } })
    .populate("owner", "fullname username avatar")
    .lean();

  return res.json({
    videos,
    total: user.watchHistory.length,
  });
});

export { getWatchHistory };
