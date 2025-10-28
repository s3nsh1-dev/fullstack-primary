import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";
import { uploadOnCloudinary } from "../../utils/cloudinary";

export const updateUserCoverImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "COVER FILE IS REQUIRED");
  }
  const coverImageLocalPath: string = req.file.path;

  const coverImage = await uploadOnCloudinary(
    coverImageLocalPath,
    "cover-image"
  );
  if (!coverImage || !coverImage.url) {
    throw new ApiError(400, "UPLOAD FAILED ON CLOUDINARY: COVER IMAGE");
  }

  if (!req?.user || !req.user?._id) {
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "USER IS NOT UPDATED WITH COVER IMAGE");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "COVER IMAGE UPDATED SUCCESSFULLY"
      )
    );
});
