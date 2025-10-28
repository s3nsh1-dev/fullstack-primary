import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";

type NameType = "email" | "fullname";
const validNames: NameType[] = ["email", "fullname"];

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, content }: { name: NameType; content: string } = req.body;

  if (!name || !content) throw new ApiError(400, "EMAIL OR NAME IS REQUIRED");
  if (!validNames.includes(name as NameType))
    throw new ApiError(400, "INCORRECT PROPERTY NAME");
  if (!req.user || !req.user._id)
    throw new ApiError(401, "USER NOT AUTHENTICATED");

  const user = await User.findByIdAndUpdate(
    req?.user._id,
    {
      $set: { [name]: content },
    },
    { new: true }
  ).select("username fullname email avatar coverImage");
  if (!user) throw new ApiError(404, "USER NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user }, "ACCOUNT DETAILS UPDATED SUCCESSFULLY")
    );
});
