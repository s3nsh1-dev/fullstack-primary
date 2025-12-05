import { isValidObjectId } from "mongoose";
import { Tweet } from "../../models/tweet.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { toObjectId } from "../../utils/convertToObjectId";
import { Like } from "../../models/like.model";

const fetchTweet = asyncHandler(async (req, res) => {
  //TODO: get tweet

  const { tweetId } = req.params;
  const userId = req.query.userId; // optional userId to check like status

  console.log("userId:", userId);
  console.log("tweetId:", tweetId);

  if (!isValidObjectId(tweetId)) throw new ApiError(400, "INVALID TWEET_ID");

  const tweet = await Tweet.findById(tweetId).populate({
    path: "owner",
    select: "username fullname avatar email coverImage",
  });

  let isLiked = false;

  if (userId && isValidObjectId(userId)) {
    const fetchLike = await Like.exists({
      likedBy: toObjectId(userId as string),
      tweet: toObjectId(tweetId as string),
    });
    isLiked = !!fetchLike;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { tweet, isLiked },
        "TWEET RETRIEVED LLLLLLLLl SUCCESSFULLY"
      )
    );
});

export { fetchTweet };
