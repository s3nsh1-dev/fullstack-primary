import { isValidObjectId } from "mongoose";
import { Playlist } from "../../models/playlist.model";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

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

export { createPlaylist };
