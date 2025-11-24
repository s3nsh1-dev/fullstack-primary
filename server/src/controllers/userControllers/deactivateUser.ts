import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { User } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { httpOptions as options } from "../../constants";

const deactivateUser = asyncHandler(async (req, res) => {
  if (!req?.user || !req?.user?._id) {
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");
  }
  const userId = req.user._id;

  const currentUser = await User.findByIdAndUpdate(
    userId,
    { $set: { isDeactivated: true } },
    { new: true }
  );
  if (!currentUser) {
    throw new ApiError(404, "USER NOT FOUND");
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, { deactivated: true }, "USER DEACTIVATED"));
});

export { deactivateUser };
