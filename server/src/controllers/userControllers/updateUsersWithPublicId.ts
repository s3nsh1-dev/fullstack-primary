import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { User } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";

const updateUsersWithPublicId = asyncHandler(async (req, res) => {
  const user = await User.find().select("username avatar coverImage updatedAt");
  if (!user || user.length === 0) throw new ApiError(404, "NO USER FOUND");
  return res.status(200).json(new ApiResponse(200, user, "USER INFO"));
});

export default updateUsersWithPublicId;
