import { isValidObjectId } from "mongoose";
import { Playlist } from "../../models/playlist.model";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

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

export { removeVideoFromPlaylist };
