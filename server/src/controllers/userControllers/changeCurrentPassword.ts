import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword }: ResponseBodyType = req.body;
  if (
    !currentPassword ||
    !newPassword ||
    currentPassword.length < 1 ||
    newPassword.length < 1
  )
    throw new ApiError(400, " CURRENT PASSWORD AND NEW PASSWORD ARE REQUIRED");

  if (!req.user || !req.user._id)
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "USER NOT FOUND");

  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json(new ApiResponse(400, false, "INCORRECT PASSWORD"));
  }
  user.password = newPassword;
  await user.save({ validateModifiedOnly: true });

  return res
    .status(200)
    .json(new ApiResponse(200, true, "PASSWORD CHANGED SUCCESSFULLY"));
});

type ResponseBodyType = {
  currentPassword: string;
  newPassword: string;
};
