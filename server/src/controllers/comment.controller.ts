import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { Comment } from "../models/comment.model";
import { asyncHandler } from "../utils/asyncHandler";
import { isOwner } from "../utils/checkIsOwner";
import { toObjectId } from "../utils/convertToObjectId";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video

  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate([
      { $match: { video: toObjectId(videoId) } },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
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
      {
        $addFields: {
          ownerDetails: { $first: "$ownerDetails" },
        },
      },
    ]),
    { page: Number(page), limit: Number(limit) }
  );
  if (!comments) throw new ApiError(400, "PAGINATED COMMENTS NOT FOUND");

  res
    .status(200)
    .json(new ApiResponse(200, { comments }, "COMMENTS FETCHED SUCCESSFULLY"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video, how its using populate in create ?

  const { video_ID } = req.params;
  const { content } = req.body;

  if (!content || content.length < 1)
    throw new ApiError(404, "CONTENT NOT FOUND");

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED USER");

  const comment = await Comment.create({
    content,
    video: toObjectId(video_ID),
    owner: toObjectId(String(req.user._id)),
  });
  if (!comment) throw new ApiError(400, "COMMENT NOT REGISTERED");

  res
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
    throw new ApiError(400, "USER NOT AUTHENTICATED");
  }

  const comment = await Comment.findById(comment_ID);
  if (!comment) throw new ApiError(404, "COMMENT NOT FOUND");

  if (!isOwner(comment.owner, req.user._id.toString())) {
    throw new ApiError(403, "NOT AUTHORIZED TO MAKE CHANGES");
  }

  const deletedComment = await Comment.deleteOne();
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

export { getVideoComments, addComment, updateComment, deleteComment };
