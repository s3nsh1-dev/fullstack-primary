import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";
import { uploadOnCloudinary } from "../../utils/cloudinary";

export const updateUserAvatar = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id)
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  if (!req.file) throw new ApiError(400, "AVATAR FILE IS REQUIRED");

  const avatarLocalPath: string = req.file.path;

  const avatar = await uploadOnCloudinary(avatarLocalPath, "profile-image");
  if (!avatar || !avatar.url) {
    throw new ApiError(404, "UPLOAD FAILED ON CLOUDINARY: AVATAR");
  }

  const updatedUser = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!updatedUser) throw new ApiError(404, "USER NOT FOUND");

  updatedUser.avatar = avatar.url;
  const userWithNewAvatar = await updatedUser.save();
  if (!userWithNewAvatar) {
    throw new ApiError(404, "USER IS NOT UPDATED WITH AVATAR");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: userWithNewAvatar },
        "AVATAR UPDATED SUCCESSFULLY"
      )
    );
});
