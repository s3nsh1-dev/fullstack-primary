import { isValidObjectId } from "mongoose";
import { Video } from "../../models/video.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary";
import { isOwner } from "../../utils/checkIsOwner";
import { Like } from "../../models/like.model";
import { Comment } from "../../models/comment.model";

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID USER_ID");
  if (!req.user || !req.user.id) throw new ApiError(400, "USER_ID IS REQUIRED");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "VIDEO NOT FOUND");

  if (!isOwner(video.owner, req.user.id)) {
    throw new ApiError(403, "NOT AUTHORIZED TO DELETE THIS VIDEO");
  }

  // delete cloudinary files first
  const deletedCloudinaryVideoFile = await deleteFromCloudinary(
    video.videoPublicId
  );
  const deletedCloudinaryThumbnailFile = await deleteFromCloudinary(
    video.thumbPublicId
  );
  if (!deletedCloudinaryVideoFile || !deletedCloudinaryThumbnailFile)
    throw new ApiError(400, "CLOUDINARY FILE DELETION FAILED");

  // ---------- CASCADE DELETE ----------
  // likes directly on video
  await Like.deleteMany({ video: video._id });

  // comments on video
  const comments = await Comment.find({ video: video._id }).select("_id");
  if (comments.length > 0) {
    const commentIds = comments.map((c) => c._id);

    // likes on comments
    await Like.deleteMany({ comment: { $in: commentIds } });

    // subcomments on those comments
    const subComments = await Comment.find({
      comment: { $in: commentIds },
    }).select("_id");
    if (subComments.length > 0) {
      const subCommentIds = subComments.map((c) => c._id);

      // likes on subcomments
      await Like.deleteMany({ comment: { $in: subCommentIds } });

      // delete subcomments
      await Comment.deleteMany({ _id: { $in: subCommentIds } });
    }

    // delete top-level comments
    await Comment.deleteMany({ _id: { $in: commentIds } });
  }
  // ---------- END CASCADE DELETE ----------

  // finally delete video itself
  const result = await video.deleteOne({ _id: videoId });
  if (!result) throw new ApiError(400, "VIDEO DELETION FAILED");

  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "VIDEO DELETED SUCCESSFULLY"));
});

export { deleteVideo };
