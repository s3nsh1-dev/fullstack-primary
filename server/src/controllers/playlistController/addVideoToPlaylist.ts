import { isValidObjectId } from "mongoose";
import { Playlist } from "../../models/playlist.model";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

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

export { addVideoToPlaylist };
