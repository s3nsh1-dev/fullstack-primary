import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { User } from "../../models/user.model";

const reactivateUser = asyncHandler(async (req, res) => {
  if (!req?.user || !req?.user?._id) {
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");
  }
  const userId = req.user._id;

  const currentUser = await User.findByIdAndUpdate(
    userId,
    { $set: { isDeactivated: false } },
    { new: true }
  );
  if (!currentUser) {
    throw new ApiError(404, "USER NOT FOUND");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { deactivated: false }, "USER DEACTIVATED"));
});

export { reactivateUser };
