import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, "CURRENT USER RETRIEVED"));
});
