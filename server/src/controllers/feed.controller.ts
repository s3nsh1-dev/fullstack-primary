import { asyncHandler } from "../utils/asyncHandler";
import { Video } from "../models/video.model";
import { Tweet } from "../models/tweet.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const getFeed = asyncHandler(async (req, res) => {
  const videos = await Video.find({ isPublished: true })
    .sort({
      createdAt: -1,
    })
    .populate({ path: "owner", select: "username fullname avatar" });
  if (!videos.length) throw new ApiError(404, "No videos found");
  const tweets = await Tweet.find().sort({ createdAt: -1 }).populate("owner");
  if (!tweets.length) throw new ApiError(404, "No tweets found");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos: { data: videos, length: videos.length },
        tweets: { data: tweets, length: tweets.length },
      },
      "FETCHED FEED SUCCESSFULLY"
    )
  );
});

export { getFeed };
