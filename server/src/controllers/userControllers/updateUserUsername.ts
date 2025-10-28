import ApiError from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";
import ApiResponse from "../../utils/ApiResponse";

export const updateUserUsername = asyncHandler(async (req, res) => {
  const { username }: JSONBodyType = req.body;
  if (!username) throw new ApiError(404, "USERNAME NOT RECEIVED");

  return res
    .status(200)
    .json(new ApiResponse(200, { username }, "USERNAME UPDATED SUCCESSFULLY"));
});

type JSONBodyType = { username: string };
