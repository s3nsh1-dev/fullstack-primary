import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { Comment } from "../models/comment.model";
import { asyncHandler } from "../utils/asyncHandler";
import { isOwner } from "../utils/checkIsOwner";
import { toObjectId } from "../utils/convertToObjectId";
import { Tweet } from "../models/tweet.model";
import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model";
import { Like } from "../models/like.model";
import mongoose from "mongoose";

const getVideoComments = asyncHandler(async (req, res) => {
  const { video_ID } = req.params;
  const { page = 1, limit = 10, userId } = req.query;

  // Build the base aggregation pipeline
  const pipeline: any[] = [
    { $match: { video: toObjectId(video_ID) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ];

  // Only add the likes lookup if userId is provided and valid
  if (userId && isValidObjectId(userId)) {
    pipeline.push({
      $lookup: {
        from: "likes",
        let: { commentId: "$_id" },
        as: "likes",
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$comment", "$$commentId"] },
                  {
                    $eq: [
                      "$likedBy",
                      new mongoose.Types.ObjectId(userId.toString()),
                    ],
                  },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
      },
    });
    pipeline.push({
      $addFields: { isLiked: { $gt: [{ $size: "$likes" }, 0] } },
    });
  } else {
    // If no userId, set isLiked to false by default
    pipeline.push({
      $addFields: { isLiked: false },
    });
  }

  // Continue with the rest of the pipeline
  pipeline.push(
    { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        content: 1,
        video: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: 1,
        isLiked: 1,
      },
    }
  );

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate(pipeline),
    { page: Number(page), limit: Number(limit) }
  );

  if (!comments) throw new ApiError(400, "PAGINATED COMMENTS NOT FOUND");

  const commentCount = await Comment.countDocuments({
    video: toObjectId(video_ID),
  });

  // Check if video is liked by the current user (from req.user)
  let isLiked = false;
  if (req.user?._id) {
    const fetchLike = await Like.exists({
      video: toObjectId(video_ID),
      likedBy: toObjectId(String(req.user._id)),
    });
    isLiked = !!fetchLike;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comments, commentCount, isLiked },
        "COMMENTS FETCHED SUCCESSFULLY"
      )
    );
});

const addVideoComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video, how its using populate in create ?

  const { video_ID } = req.params;
  const { content } = req.body;

  if (!content || content.length < 1)
    throw new ApiError(404, "CONTENT NOT FOUND");

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED USER");

  if (!isValidObjectId(video_ID)) throw new ApiError(400, "INVALID VIDEO ID");

  const video = await Video.findById(video_ID);
  if (!video) throw new ApiError(404, "VIDEO NOT FOUND");

  const comment = await Comment.create({
    content,
    video: toObjectId(video_ID),
    owner: toObjectId(String(req.user._id)),
  });
  if (!comment) throw new ApiError(400, "COMMENT NOT REGISTERED");

  return res
    .status(200)
    .json(new ApiResponse(200, { comment }, "COMMENT REGISTER SUCCESSFULLY"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment

  if (!req.user || !req.user._id) throw new ApiError(401, "Unauthorized");

  const { comment_ID } = req.params;
  if (!comment_ID) throw new ApiError(404, "COMMENT ID NOT FOUND");

  const { content } = req.body;
  if (!content || content.length < 1)
    throw new ApiError(404, "CONTENT NOT FOUND");

  const comment = await Comment.findById(comment_ID);
  if (!comment) throw new ApiError(404, "COMMENT NOT FOUND");

  // check owner
  if (!isOwner(comment.owner, req.user._id.toString())) {
    throw new ApiError(400, "NOT AUTHORIZED TO MAKE CHANGES");
  }

  const updateComment = await Comment.findByIdAndUpdate(
    comment_ID,
    { $set: { content } },
    { new: true }
  )
    .populate("owner", " _id avatar fullname")
    .populate("video", "_id title");
  if (!updateComment) throw new ApiError(400, "COMMENT NOT UPDATED");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result: updateComment },
        "COMMENT UPDATED SUCCESSFULLY"
      )
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment

  const { comment_ID } = req.params;
  if (!comment_ID) throw new ApiError(400, "COMMENT NOT FOUND");
  if (!req.user || !req.user._id) {
    throw new ApiError(400, "USER NOT AUTHENTICATED");
  }

  const comment = await Comment.findById(comment_ID)
    .populate({
      path: "tweet",
      select: "_id content owner updatedAt",
      populate: { path: "owner", select: "_id fullname username avatar" },
    })
    .populate({
      path: "video",
      select: "_id title thumbnail videoFile owner updatedAt",
      populate: { path: "owner", select: "_id fullname username avatar" },
    })
    .populate({
      path: "comment",
      select: "_id content owner updatedAt",
      populate: { path: "owner", select: "_id fullname username avatar" },
    });
  if (!comment) throw new ApiError(404, "COMMENT NOT FOUND");

  const foo =
    comment.tweet?.owner?._id ??
    comment.video?.owner?._id ??
    comment.comment?.owner?._id;

  if (
    !isOwner(comment.owner, req.user._id.toString()) &&
    !isOwner(foo, req.user._id.toString())
  ) {
    throw new ApiError(
      403,
      "NOT AUTHORIZED TO MAKE CHANGES COZ NEITHER COMMENT OWNER NOR CONTENT OWNER"
    );
  }

  // search for nested comments
  const nestedComments = await Comment.find({ comment: comment._id }).select(
    "_id content comment owner"
  );
  if (nestedComments.length > 0) {
    for (let com of nestedComments) {
      const comID = com._id;
      await Like.findOneAndDelete({ comment: comID });
      await com.deleteOne({ _id: comID });
    }
  }

  const searchLike = await Like.findOneAndDelete({ comment: comment._id });
  const result = await comment.deleteOne({ _id: comment_ID });

  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "Comment deleted successfully"));
});

const getTweetComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video

  const { tweet_ID } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED USER");

  const adminId = req.user._id;
  const comments = await Comment.aggregatePaginate(
    Comment.aggregate([
      { $match: { tweet: toObjectId(tweet_ID) } },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                _id: 1,
                fullname: 1,
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { commentId: "$_id" },
          as: "likes",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$comment", "$$commentId"] },
                    {
                      $eq: [
                        "$likedBy",
                        new mongoose.Types.ObjectId(adminId.toString()),
                      ],
                    },
                  ],
                },
              },
            },
            { $limit: 1 }, // ✅ return only 1 doc if it exists
          ],
        },
      },
      { $addFields: { isLiked: { $gt: [{ $size: "$likes" }, 0] } } },
      { $addFields: { owner: { $first: "$owner" } } },
      {
        $project: {
          _id: 1,
          content: 1,
          tweet: 1,
          createdAt: 1,
          updatedAt: 1,
          owner: 1,
          isLiked: 1,
        },
      },
    ]),
    { page: Number(page), limit: Number(limit) }
  );
  if (!comments) throw new ApiError(400, "PAGINATED COMMENTS NOT FOUND");

  if (!comments) throw new ApiError(400, "PAGINATED COMMENTS NOT FOUND");
  const commentCount = await Comment.countDocuments({
    tweet: toObjectId(tweet_ID),
  });

  const fetchLike = await Like.exists({
    tweet: toObjectId(tweet_ID),
    likedBy: toObjectId(String(req.user?._id)),
  });

  const isLiked = fetchLike ? true : false;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comments, commentCount, isLiked },
        "COMMENTS FETCHED SUCCESSFULLY"
      )
    );
});

const addTweetComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video, how its using populate in create ?

  const { tweet_ID } = req.params;
  const { content } = req.body;

  if (!content || content.length < 1)
    throw new ApiError(404, "CONTENT NOT FOUND");

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED USER");

  const tweet = await Tweet.findById(tweet_ID);
  if (!tweet) throw new ApiError(404, "TWEET NOT FOUND");

  const comment = await Comment.create({
    content,
    tweet: toObjectId(tweet_ID),
    owner: toObjectId(String(req.user._id)),
  });
  if (!comment) throw new ApiError(400, "COMMENT NOT REGISTERED");

  return res
    .status(200)
    .json(new ApiResponse(200, { comment }, "COMMENT REGISTER SUCCESSFULLY"));
});

const addCommentToComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a comment

  const { comment_ID } = req.params;
  const { content } = req.body;

  if (!content || content.length < 1)
    throw new ApiError(404, "CONTENT NOT FOUND");

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED USER");

  const comment = await Comment.findById(comment_ID);
  if (!comment) throw new ApiError(404, "COMMENT NOT FOUND");

  const newComment = await Comment.create({
    content,
    comment: comment_ID,
    owner: toObjectId(String(req.user._id)),
  });
  if (!newComment) throw new ApiError(400, "COMMENT NOT REGISTERED");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comment: newComment },
        "COMMENT REGISTERED SUCCESSFULLY"
      )
    );
});

const getCommentsComment = asyncHandler(async (req, res) => {
  // TODO: get all comments for a comment
  const { comment_ID } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED USER");

  const adminId = String(req.user._id);

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate([
      { $match: { comment: toObjectId(comment_ID) } },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                _id: 1,
                fullname: 1,
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { commentId: "$_id" },
          as: "likes",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$comment", "$$commentId"] },
                    {
                      $eq: ["$likedBy", new mongoose.Types.ObjectId(adminId)],
                    },
                  ],
                },
              },
            },
            { $limit: 1 }, // ✅ return only 1 doc if it exists
          ],
        },
      },
      { $addFields: { isLiked: { $gt: [{ $size: "$likes" }, 0] } } },
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          comment: 1,
          createdAt: 1,
          updatedAt: 1,
          owner: 1,
          isLiked: 1,
        },
      },
    ]),
    { page: Number(page), limit: Number(limit) }
  );
  if (!comments) throw new ApiError(400, "PAGINATED COMMENTS NOT FOUND");

  if (!comments) throw new ApiError(400, "PAGINATED COMMENTS NOT FOUND");
  const commentCount = await Comment.countDocuments({
    comment: toObjectId(comment_ID),
  });

  const fetchLike = await Like.exists({
    comment: toObjectId(comment_ID),
    likedBy: toObjectId(String(req.user?._id)),
  });

  const isLiked = fetchLike ? true : false;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comments, commentCount, isLiked },
        "COMMENTS FETCHED SUCCESSFULLY"
      )
    );
});

export {
  getVideoComments,
  addVideoComment,
  updateComment,
  deleteComment,
  getTweetComments,
  addTweetComment,
  addCommentToComment,
  getCommentsComment,
};
