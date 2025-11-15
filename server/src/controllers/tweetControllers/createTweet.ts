import { Tweet } from "../../models/tweet.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { toObjectId } from "../../utils/convertToObjectId";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "USER NOT VERIFIED");
  }

  const tweet = await Tweet.create({
    owner: toObjectId(req.user._id as string),
    content,
  });
  if (!tweet) {
    throw new ApiError(400, "TWEET CREATION FAILED");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, { tweet }, "NEW TWEET CREATED"));
});

export { createTweet };
