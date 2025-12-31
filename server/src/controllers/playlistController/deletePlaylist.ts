import { isValidObjectId } from "mongoose";
import { Playlist } from "../../models/playlist.model";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

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

export { deletePlaylist };
