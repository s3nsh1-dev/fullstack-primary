import mongoose from "mongoose";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { Comment } from "../models/comment.model";
import { asyncHandler } from "../utils/asyncHandler";
import { isOwner } from "../utils/checkIsOwner";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video

  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const videoComments = await Comment.aggregate([
    { $match: { video: videoId } },
    {
      $lookup: {
        from: "user",
        as: "ownerDetails",
        foreignField: "_id",
        localField: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    { $skip: Number((+page - 1) * +limit) },
  ]);
  if (!videoComments) {
    throw new ApiError(400, "COMMENTS NOT FOUND");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comments: videoComments },
        "COMMENTS FETCHED SUCCESSFULLY"
      )
    );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video, how its using populate in create ?

  const { video_ID } = req.params;
  const { content } = req.body;
  if (!req.user || !req.user._id) throw new ApiError(400, "UNAUTHORIZED USER");

  const comment = await Comment.create({
    content,
    video: new mongoose.Schema.Types.ObjectId(video_ID),
    owner: new mongoose.Schema.Types.ObjectId(String(req.user._id)),
  });
  if (!comment) throw new ApiError(400, "COMMENT NOT REGISTERED");

  res
    .status(200)
    .json(new ApiResponse(200, { comment }, "COMMENT REGISTER SUCCESSFULLY"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment

  const { comment_ID } = req.params;
  const { content } = req.body;

  const updateComment = await Comment.findByIdAndUpdate(
    comment_ID,
    { $set: { content } },
    { new: true }
  )
    .populate("owner", " _id avatar fullname")
    .populate("video", "_id title");
  if (!updateComment) throw new ApiError(400, "COMMENT NOT UPDATED");

  res
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
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }

  const comment = await Comment.findById(comment_ID);
  if (!comment) throw new ApiError(404, "COMMENT NOT FOUND");

  if (isOwner(comment.owner, req.user._id.toString())) {
    throw new ApiError(403, "USER NOT AUTHORIZED TO MAKE CHANGES");
  }

  const deleteComment = await Comment.findByIdAndDelete(comment_ID)
    .populate("owner", "_id fullname")
    .populate("video", "_id title");
  if (!deleteComment) throw new ApiError(404, "COMMENT NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result: deleteComment },
        "Comment deleted successfully"
      )
    );
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

export { getVideoComments, addComment, updateComment, deleteComment };

 */
