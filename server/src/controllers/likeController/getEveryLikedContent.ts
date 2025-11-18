import { isValidObjectId } from "mongoose";
import { Like } from "../../models/like.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

const getEveryLikedContent = asyncHandler(async (req, res) => {
  // TODO: get all liked videos/comments/tweets

  const { userId } = req.params;
  if (!isValidObjectId(userId)) throw new ApiError(400, "INVALID USER_ID");

  // const page = parseInt(req.query.page) || 1;
  // const limit = parseInt(req.query.limit) || 20;
  // const skip = (page - 1) * limit;

  const liked = await Like.find({ likedBy: userId })
    .populate({
      path: "tweet",
      select: "_id owner updatedAt content",
      populate: { path: "owner", select: "_id fullname username avatar" },
    })
    .populate({
      path: "comment",
      select: "_id owner updatedAt content tweet comment video",
      populate: { path: "owner", select: "_id fullname username avatar" },
    })
    .populate({
      path: "video",
      select: "_id owner updatedAt videoFile thumbnail title description",
      populate: { path: "owner", select: "_id fullname username avatar" },
    })
    .select("_id likedBy updatedAt tweet comment video")
    .sort({ updatedAt: -1 });
  // .skip(skip)
  // .limit(limit);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { liked, total: liked.length },
        "USER LIKED CONTENT FETCHED SUCCESSFULLY"
      )
    );
});

export { getEveryLikedContent };
