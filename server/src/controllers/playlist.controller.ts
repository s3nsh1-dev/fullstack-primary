import { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { toObjectId } from "../utils/convertToObjectId";
import { isOwner } from "../utils/checkIsOwner";

const createPlaylist = asyncHandler(async (req, res) => {
  //TODO: create playlist

  const { name } = req.body;
  const description = req.body.description || "";
  if (!name || name.length < 1) throw new ApiError(404, "INPUT FIELD MISSING");

  if (!req.user || !req.user._id)
    throw new ApiError(401, "UNAUTHENTICATED REQUEST");
  if (!isValidObjectId(req.user._id))
    throw new ApiError(404, "INVALID USER_ID");

  const createPlaylist = await Playlist.create({
    name,
    description,
    videos: [],
    owner: req.user._id as string,
  });

  if (!createPlaylist) throw new ApiError(404, "PLAYLIST NOT CREATED");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlist: createPlaylist },
        "PLAYLIST CREATED SUCCESSFULLY"
      )
    );
});

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

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  // TODO: add video to playlist + check owner + same video can not be added twice

  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId))
    throw new ApiError(404, "INVALID PLAYLIST_ID OR VIDEO_ID");

  if (!req.user || !req.user._id)
    throw new ApiError(401, "UNAUTHENTICATED REQUEST");

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId, owner: req.user._id },
    { $addToSet: { videos: videoId } },
    { new: true, runValidators: true }
  ).populate("owner", "_id username fullname avatar");

  if (!updatedPlaylist)
    throw new ApiError(404, "PLAYLIST NOT FOUND OR USER NOT AUTHORIZED");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlist: updatedPlaylist },
        "VIDEO ADDED TO PLAYLIST"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // TODO: remove video from playlist + check owner

  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId))
    throw new ApiError(400, "INVALID PLAYLIST_ID OR VIDEO_ID");

  if (!req?.user || !req?.user?._id)
    throw new ApiError(401, "UNAUTHENTICATED REQUEST");

  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id,
    },
    { $pull: { videos: videoId } },
    { new: true }
  ).populate("owner", "_id username fullname avatar");
  if (!playlist)
    throw new ApiError(404, "PLAYLIST NOT FOUND OR USER NOT AUTHORIZED");

  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "VIDEO REMOVED FROM PLAYLIST"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // TODO: delete playlist + check owner

  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "INVALID PLAYLIST_ID");

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  const deletedPlaylist = await Playlist.deleteOne({
    _id: playlistId,
    owner: req.user._id,
  });
  if (!deletedPlaylist) throw new ApiError(400, "PLAYLIST NOT DELETED");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result: deletedPlaylist },
        "PLAYLIST DELETED SUCCESSFULLY"
      )
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  //TODO: update playlist + check owner

  const { playlistId } = req.params;
  if (!playlistId) throw new ApiError(404, "PLAYLIST_ID NOT PROVIDED");
  if (!isValidObjectId(playlistId))
    throw new ApiError(404, "INVALID PLAYLIST_ID");

  const name =
    typeof req.body.name === "string" ? req.body.name.trim() : undefined;
  const description =
    typeof req.body.description === "string"
      ? req.body.description.trim()
      : undefined;
  if (name === undefined && description === undefined)
    throw new ApiError(404, "NO VALID FIELDS PROVIDED");

  if (!req?.user || !req?.user?._id)
    throw new ApiError(401, "UNAUTHENTICATED REQUEST");

  const updatePayload: Record<string, string> = {};

  if (name !== undefined) updatePayload.name = name;
  if (description !== undefined) updatePayload.description = description;

  if (!Object.keys(updatePayload).length)
    throw new ApiError(404, "NO FIELDS TO UPDATE");

  const playlist = await Playlist.findOneAndUpdate(
    { _id: playlistId, owner: req.user._id },
    { $set: updatePayload },
    { new: true }
  ).populate("owner", "_id username fullname avatar");

  if (!playlist)
    throw new ApiError(403, "USER NOT AUTHORIZED OR PLAYLIST NOT FOUND");

  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "PLAYLIST UPDATED SUCCESSFULLY"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
