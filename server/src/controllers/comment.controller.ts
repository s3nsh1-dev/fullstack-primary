import mongoose from "mongoose";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { Comment } from "../models/comment.model";
import { asyncHandler } from "../utils/asyncHandler";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
});

export { getVideoComments, addComment, updateComment, deleteComment };

/*

import mongoose from "mongoose";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { Comment } from "../models/comment.model";
import { asyncHandler } from "../utils/asyncHandler";
import { UserThisType } from "../constants/ModelTypes";
import { Request } from "express";

interface CustomRequest extends Request {
  user?: UserThisType;
}

const getVideoComments = asyncHandler(async (req: CustomRequest, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const commentsAggregate = Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    },
  ]);

  const options = {
    page: Number(page),
    limit: Number(limit),
  };

  const comments = await Comment.aggregatePaginate(commentsAggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req: CustomRequest, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content || !videoId) {
    throw new ApiError(400, "Content and Video ID are required");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user?._id,
  });

  const createdComment = await Comment.findById(comment._id).populate("owner");

  if (!createdComment) {
    throw new ApiError(500, "Something went wrong while creating comment");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req: CustomRequest, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content || !commentId) {
    throw new ApiError(400, "Content and Comment ID are required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized");
  }

  if (comment.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized to update this comment");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  ).populate("owner");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req: CustomRequest, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized");
  }

  if (comment.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };

 */
