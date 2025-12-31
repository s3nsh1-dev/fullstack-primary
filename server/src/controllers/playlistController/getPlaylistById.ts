import { isValidObjectId } from "mongoose";
import { Playlist } from "../../models/playlist.model";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { toObjectId } from "../../utils/convertToObjectId";

const getPlaylistById = asyncHandler(async (req, res) => {
  //TODO: get playlist by id

  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "INVALID PLAYLIST_ID");

  const playlist = await Playlist.aggregate([
    { $match: { _id: toObjectId(String(playlistId)) } },
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
              avatar: 1,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          { $match: { isPublished: true } },
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
                    avatar: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
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
          { $unwind: { path: "$owner" } },
        ],
      },
    },
    { $unwind: { path: "$owner" } },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        videos: 1,
        owner: 1,
      },
    },
  ]);
  if (!playlist) throw new ApiError(400, "PLAYLIST NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlist: playlist[0] },
        "PLAYLIST FETCHED SUCCESSFULLY"
      )
    );
});

export { getPlaylistById };
