import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, " CURRENT PASSWORD AND NEW PASSWORD ARE REQUIRED");
  }

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }

  const user = await User.findById(req?.user._id);
  if (!user) {
    throw new ApiError(404, "USER NOT FOUND");
  }

  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, " INVALID CURRENT PASSWORD");
  }

  user.password = newPassword;
  await user.save({ validateModifiedOnly: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "PASSWORD CHANGED SUCCESSFULLY"));
});
