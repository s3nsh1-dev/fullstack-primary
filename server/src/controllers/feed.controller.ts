import { asyncHandler } from "../utils/asyncHandler";
import { Video } from "../models/video.model";
import { Tweet } from "../models/tweet.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const getFeed = asyncHandler(async (req, res) => {
  const FEED_LIMIT = 20;

  const [videos, tweets] = await Promise.all([
    Video.find({ isPublished: true })
      .populate({ path: "owner", select: "username fullname avatar" })
      .limit(FEED_LIMIT),
    Tweet.find()
      .populate({ path: "owner", select: "username fullname avatar" })
      .limit(FEED_LIMIT),
  ]);
  if (!videos.length && !tweets.length)
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { videos: [], tweets: [], feed: [] },
          "No content yet"
        )
      );

  const feed = [...videos, ...tweets].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { feed, length: feed.length },
        "Fetched feed successfully"
      )
    );
});

export { getFeed };
