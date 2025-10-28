import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const {
    name,
    content,
  }: { name: "email" | "fullname" | "username"; content: string } = req.body;

  if (!name || !content) {
    throw new ApiError(400, "EMAIL OR NAME IS REQUIRED");
  }
  // type NameType = "email" | "fullname" | "username";
  // if (typeof name !== NameType) {
  // }

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }

  const user = await User.findByIdAndUpdate(
    req?.user._id,
    {
      $set: { [name]: content },
    },
    { new: true }
  ).select("-password ");
  if (!user) throw new ApiError(404, "USER NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user }, "ACCOUNT DETAILS UPDATED SUCCESSFULLY")
    );
});
