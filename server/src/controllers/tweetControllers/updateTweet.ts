import { isValidObjectId } from "mongoose";
import { Tweet } from "../../models/tweet.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { toObjectId } from "../../utils/convertToObjectId";

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  const { content } = req.body;
  const { tweetId } = req.params;
  if (!req.user || !req.user._id) throw new ApiError(401, "UNAUTHORIZED USER");
  if (!isValidObjectId(tweetId)) throw new ApiError(400, "INVALID TWEET_ID");
  if (!content) throw new ApiError(400, "CONTENT NOT FOUND");

  const updatedTweet = await Tweet.aggregate([
    {
      $match: {
        _id: toObjectId(tweetId),
        owner: toObjectId(req.user._id as string),
      },
    },
    { $set: { content } },
    {
      $merge: {
        into: "tweets",
        on: "_id",
        whenMatched: "merge",
        whenNotMatched: "discard",
      },
    },
  ]);

  if (!updatedTweet) throw new ApiError(404, "TWEET NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { tweet: updatedTweet[0] },
        "TWEET UPDATED SUCCESSFULLY"
      )
    );
});

export { updateTweet };
