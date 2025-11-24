import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model";
import { Video } from "../models/video.model";
import { Subscription } from "../models/subscription.model";

const getDetailsForHomepage = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { userId } = req.query;
  if (!username) throw new ApiError(400, "INVALID USERNAME");

  const user = await User.aggregate([
    {
      $match: { username: username, isDeactivated: false, isSuspended: false },
    },
    {
      // final API look
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        fullname: 1,
        avatar: 1,
        coverImage: 1,
        createdAt: 1,
        subscribers: 1,
        videos: 1,
        tweets: 1,
        playlists: 1,
      },
    },
  ]);
  if (!user) throw new ApiError(401, "USER NOT FOUND FOR HOMEPAGE");
  if (!isValidObjectId(user[0]?._id))
    throw new ApiError(400, "INVALID USER_ID FOUND ON HOMEPAGE");

  const totalSubscribersCount = await Subscription.countDocuments({
    channel: user[0]?._id,
  });
  const totalVideosCount = await Video.countDocuments({ owner: user[0]?._id });
  const totalTweetsCount = await Tweet.countDocuments({ owner: user[0]?._id });
  let isSubbed = false;
  if (userId && isValidObjectId(userId)) {
    const checkSubbed = await Subscription.findOne({
      channel: user[0]?._id,
      subscriber: userId,
    });
    isSubbed = checkSubbed ? true : false;
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: user[0],
        isSubbed,
        totalSubscribers: totalSubscribersCount,
        totalVideos: totalVideosCount,
        totalTweets: totalTweetsCount,
      },
      "LOGGED IN USER'S AUTH DETAILS"
    )
  );
});
export { getDetailsForHomepage };
