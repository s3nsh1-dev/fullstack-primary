// import { Video } from "../models/video.model";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import mongoose, { isValidObjectId } from "mongoose";

const getWatchHistory = asyncHandler(async (req, res) => {
  //TODO: get watchHistory for a user
  if (!req.user || !req.user?._id) throw new ApiError(401, "Unauthorized");
  const userId = req.user._id;
  const userWatchHistory = await User.findById(userId)
    .select("watchHistory")
    .populate({
      path: "watchHistory",
      select:
        "owner title description videoFile thumbnail views duration isPublished updatedAt createdAt",
      populate: { path: "owner", select: "fullname username avatar" },
    }); // Populate uploader's username and avatar
  if (!userWatchHistory) throw new ApiError(404, "User not found");

  const userMe = await User.findById(userId);
  if (!userMe) throw new ApiError(404, "User not found");

  // ✅ Convert ObjectId array to string array for comparison
  const history = Array.isArray(userMe?.watchHistory)
    ? (userMe!.watchHistory as mongoose.Types.ObjectId[]).map((id) =>
        id.toString()
      )
    : ["green"];

  console.log("history array:", history);

  return res
    .status(200)
    .json(new ApiResponse(200, userWatchHistory, "Watch history fetched"));
});

const addToWatchHistory = asyncHandler(async (req, res) => {
  if (!req.user || !req.user?._id) throw new ApiError(401, "Unauthorized");

  const userId = req.user._id;
  const { videoId } = req.params;

  if (!videoId) throw new ApiError(400, "Video ID is required");
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

  await User.findByIdAndUpdate(
    userId,
    [
      {
        $set: {
          watchHistory: {
            $concatArrays: [
              [videoId], // 1️⃣ Put the new video ID at the front
              {
                $filter: {
                  input: "$watchHistory", // 2️⃣ Take the current watchHistory array
                  as: "video",
                  cond: { $ne: ["$$video", videoId] }, // 3️⃣ Exclude any occurrence of the same video
                },
              },
            ],
            $slice: 20, // 4️⃣ Keep only the first 20 items (most recent)
          },
        },
      },
    ],
    { new: true }
  );

  const user = await User.findById(userId).select("watchHistory");

  return res
    .status(200)
    .json(
      new ApiResponse(200, user?.watchHistory, "Video added to watch history")
    );
});

export { addToWatchHistory, getWatchHistory };
