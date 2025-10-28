import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { User } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";

const newUsernameUpdate = asyncHandler(async (req, res) => {
  const { username } = req.body;
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { username } },
    { new: true }
  ).select("username fullname email");

  if (!user) throw new ApiError(404, "USER NOT FOUND");
  return res
    .status(200)
    .json(
      new ApiResponse(200, { update: user }, "USERNAME SUCCESSFULLY UPDATED")
    );
});
export { newUsernameUpdate };
