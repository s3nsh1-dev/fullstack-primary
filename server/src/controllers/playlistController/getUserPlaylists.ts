import { isValidObjectId } from "mongoose";
import { Playlist } from "../../models/playlist.model";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { toObjectId } from "../../utils/convertToObjectId";

const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists

  const { userId } = req.params;
  if (!isValidObjectId(userId)) throw new ApiError(400, "INVALID USER_ID");

  const playlists = await Playlist.aggregate([
    { $match: { owner: toObjectId(String(userId)) } },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $project: {
              title: 1,
              description: 1,
              thumbnail: 1,
              videoFile: 1,
              duration: 1,
              views: 1,
              isPublished: 1,
              updatedAt: 1,
              owner: 1,
            },
          },
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
                    avatar: 1,
                    username: 1,
                    fullname: 1,
                  },
                },
              ],
            },
          },
          { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        ],
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        videos: 1, // now videos are full objects, not just IDs
        owner: 1,
        updatedAt: 1,
        createdAt: 1,
      },
    },
  ]);
  if (!playlists) throw new ApiError(400, "NO PLAYLIST FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlists, length: playlists.length },
        "USER PLAYLISTS FETCHED SUCCESSFULLY"
      )
    );
});

export { getUserPlaylists };
