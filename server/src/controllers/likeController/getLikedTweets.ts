import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../../models/like.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

const getLikedTweets = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHORIZED REQUEST");

  const likedTweets = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id.toString()),
        tweet: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "tweetDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              owner: 1,
              content: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$tweetDetails",
    },
    {
      $lookup: {
        from: "users",
        localField: "tweetDetails.owner",
        foreignField: "_id",
        as: "tweetOwner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        tweetOwner: { $first: "$tweetOwner" },
      },
    },
    {
      $project: {
        _id: 1,
        tweet: 1,
        likedBy: 1,
        tweetDetails: 1,
        tweetOwner: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!likedTweets) throw new ApiError(404, "LIKES NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes: likedTweets, length: likedTweets.length },
        "USER LIKED TWEETS FETCHED SUCCESSFULLY"
      )
    );
});

export { getLikedTweets };
