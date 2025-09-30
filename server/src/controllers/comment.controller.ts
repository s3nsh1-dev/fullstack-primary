import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { Comment } from "../models/comment.model";
import { asyncHandler } from "../utils/asyncHandler";
import { isOwner } from "../utils/checkIsOwner";
import { toObjectId } from "../utils/convertToObjectId";
import { Tweet } from "../models/tweet.model";
import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video

  const { video_ID } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate([
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
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          video: 1,
          createdAt: 1,
          updatedAt: 1,
          owner: 1,
        },
      },
    ]),
    { page: Number(page), limit: Number(limit) }
  );
  if (!comments) throw new ApiError(400, "PAGINATED COMMENTS NOT FOUND");

  return res
    .status(200)
    .json(new ApiResponse(200, { comments }, "COMMENTS FETCHED SUCCESSFULLY"));
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

  const comment = await Comment.findById(comment_ID);
  if (!comment) throw new ApiError(404, "COMMENT NOT FOUND");

  // the owner of the content in which comment is being made should be able to delete the comment
  // like comment.content.owner<by aggregate|populate> === req.user._id

  if (!isOwner(comment.owner, req.user._id.toString()) && !isAdmin(req.user)) {
    throw new ApiError(403, "NOT AUTHORIZED TO MAKE CHANGES");
  }

  const deletedComment = await Comment.deleteOne({ _id: comment_ID });
  if (!deletedComment) throw new ApiError(404, "COMMENT NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result: deletedComment },
        "Comment deleted successfully"
      )
    );
});

const getTweetComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video

  const { tweet_ID } = req.params;
  const { page = 1, limit = 10 } = req.query;

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
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          tweet: 1,
          createdAt: 1,
          updatedAt: 1,
          owner: 1,
        },
      },
    ]),
    { page: Number(page), limit: Number(limit) }
  );
  if (!comments) throw new ApiError(400, "PAGINATED COMMENTS NOT FOUND");

  return res
    .status(200)
    .json(new ApiResponse(200, { comments }, "COMMENTS FETCHED SUCCESSFULLY"));
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
        },
      },
    ]),
    { page: Number(page), limit: Number(limit) }
  );
  if (!comments) throw new ApiError(400, "PAGINATED COMMENTS NOT FOUND");

  return res
    .status(200)
    .json(new ApiResponse(200, { comments }, "COMMENTS FETCHED SUCCESSFULLY"));
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
