import { asyncHandler } from "../utils/asyncHandler";
import { Video } from "../models/video.model";
import { View } from "../models/view.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const incrementView = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { watchTime } = req.body;
  const userId = req.user?._id;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];

  // Validate watchTime
  if (typeof watchTime !== "number" || watchTime < 0) {
    throw new ApiError(400, "Invalid watch time provided");
  }

  // Get video duration
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Only count if user watched at least 30% or 30 seconds (whichever is less)
  const minWatchTime = Math.min(video.duration * 0.1, 5);

  if (watchTime < minWatchTime) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { counted: false, reason: "Insufficient watch time" },
          "View not counted"
        )
      );
  }

  // Create fingerprint for duplicate detection
  const fingerprint = userId?.toString() || `${ipAddress}-${userAgent}`;

  // Check for duplicate view in last 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const recentView = await View.findOne({
    videoId,
    fingerprint,
    createdAt: { $gte: twentyFourHoursAgo },
  });

  if (recentView) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { counted: false, reason: "Already viewed recently" },
          "View already counted in last 24 hours"
        )
      );
  }

  // Create new view record
  await View.create({
    videoId,
    userId: userId || null,
    fingerprint,
    watchTime,
    ipAddress,
    userAgent,
  });

  // Increment video views count
  await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }, { new: true });

  return res
    .status(200)
    .json(new ApiResponse(200, { counted: true }, "View counted successfully"));
});

export { incrementView };
