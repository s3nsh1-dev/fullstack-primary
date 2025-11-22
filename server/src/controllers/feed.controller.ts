import { asyncHandler } from "../utils/asyncHandler";
import { Video } from "../models/video.model";
import { Tweet } from "../models/tweet.model";
import ApiResponse from "../utils/ApiResponse";

const getFeed = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 30;

  const contentLimit = Math.ceil(limit / 2);
  const skip = (page - 1) * contentLimit;

  const [videos, tweets] = await Promise.all([
    Video.aggregate([
      { $match: { isPublished: true } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: contentLimit },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            { $match: { isDeactivated: false, isSuspended: false } },
            {
              $project: {
                username: 1,
                fullname: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
      { $match: { owner: { $exists: true, $ne: null } } },
    ]),
    Tweet.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: contentLimit },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            { $match: { isDeactivated: false, isSuspended: false } },
            {
              $project: {
                username: 1,
                fullname: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
      { $match: { owner: { $exists: true, $ne: null } } },
    ]),
  ]);

  const feed = [...videos, ...tweets].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const hasNextPage =
    videos.length === contentLimit || tweets.length === contentLimit;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        feed,
        feedLen: feed.length,
        currentPage: page,
        limit,
        hasNextPage,
      },
      "Fetched feed successfully"
    )
  );
});

export { getFeed };
