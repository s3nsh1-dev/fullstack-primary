import { isValidObjectId } from "mongoose";
import { Tweet } from "../../models/tweet.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { toObjectId } from "../../utils/convertToObjectId";

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "INVALID USER_ID");
  }
  if (
    !page ||
    !limit ||
    page < 1 ||
    limit < 1 ||
    Number.isNaN(page) ||
    Number.isNaN(limit)
  ) {
    throw new ApiError(400, "INVALID PAGINATION PARAMETER");
  }

  const skip = (page - 1) * limit;

  const foo: IFooItem[] = await Tweet.aggregate([
    { $match: { owner: toObjectId(userId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { username: 1, fullname: 1, avatar: 1 } }],
      },
    },
    { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "likes",
        let: { tweetId: "$_id" }, // this is tweet_id fetched during execution
        as: "likedDetails",
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$tweet", "$$tweetId"] },
                  { $eq: ["$likedBy", toObjectId(userId)] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
      },
    },
    {
      $addFields: {
        isLiked: {
          $cond: [{ $gt: [{ $size: "$likedDetails" }, 0] }, true, false],
        },
      },
    },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              content: 1,
              owner: 1,
              createdAt: 1,
              updatedAt: 1,
              isLiked: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const totalTweets = foo[0]?.totalCount[0]?.count;
  const tweets = foo[0]?.data || [];
  const totalPages = Math.ceil(totalTweets / limit);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { tweets, totalTweets, totalPages, currentPage: page, limit },
        "USER TWEETS RETRIEVED"
      )
    );
});

export { getUserTweets };

interface IOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string; // URL string
}
interface ITweet {
  _id: string;
  content: string;
  owner: IOwner;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isLiked: boolean;
}
interface ITotalCount {
  count: number;
}
interface IFooItem {
  data: ITweet[];
  totalCount: ITotalCount[];
}
