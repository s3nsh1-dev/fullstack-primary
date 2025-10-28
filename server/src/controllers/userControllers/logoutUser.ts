import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";
import { httpOptions as options } from "../../constants";

export const logoutUser = asyncHandler(async (req, res) => {
  // get the user from middleware and delete the refreshToken
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, { loggedIn: false }, "User logged Out"));
});
