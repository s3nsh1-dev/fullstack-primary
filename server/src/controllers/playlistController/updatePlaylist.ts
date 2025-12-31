import { isValidObjectId } from "mongoose";
import { Playlist } from "../../models/playlist.model";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

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

export { updatePlaylist };
