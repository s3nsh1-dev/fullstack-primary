import mongoose from "mongoose";
import { Like } from "../../models/like.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

const getLikedComments = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHORIZED REQUEST");
  const userId = req.user._id as string;

  const likedComments = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        comment: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "comment",
        foreignField: "_id",
        as: "commentDetails",
      },
    },
    {
      $unwind: "$commentDetails",
    },
    {
      $lookup: {
        from: "users",
        localField: "commentDetails.owner",
        foreignField: "_id",
        as: "commentOwner",
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
      $unwind: "$commentOwner",
    },
    {
      $project: {
        _id: 1,
        comment: 1,
        likedBy: 1,
        commentDetails: 1,
        commentOwner: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!likedComments) throw new ApiError(404, "LIKES NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes: likedComments, length: likedComments.length },
        "USER LIKED VIDEOS FETCHED SUCCESSFULLY"
      )
    );
});

export { getLikedComments };
