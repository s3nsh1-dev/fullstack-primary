import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { User } from "../models/user.model";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  // console.log("email: ", email);
  if (
    [fullName, email, username, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "fill all required field");
  }
  const exitedUser = await User.findOne({
    $or: [{ username, email }],
  });
  if (exitedUser)
    throw new ApiError(409, "User with email or username already exist");

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const avatarPath = files.avatar?.[0]?.path;
});

export { registerUser };
