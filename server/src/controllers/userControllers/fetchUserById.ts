import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";
import { isValidObjectId } from "mongoose";

export const fetchUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "INVALID USER ID");
  }

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "USER NOT FOUND");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "USER FETCHED SUCCESSFULLY"));
});
