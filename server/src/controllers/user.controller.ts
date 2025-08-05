import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import ApiResponse from "../utils/ApiResponse";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
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

  // read about this type casting
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const avatarLocalPath = files.avatar[0]?.path;
  const coverImagePath = files.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(404, "Avatar not uploaded correctly to multer");
  }
  const checkAvatarCloudinaryUpload = await uploadOnCloudinary(avatarLocalPath);

  if (!coverImagePath)
    throw new ApiError(404, "CoverImage not Uploaded Correctly to multer");
  const checkCoverImageCloudinaryUpload =
    await uploadOnCloudinary(coverImagePath);

  if (
    [checkAvatarCloudinaryUpload, checkCoverImageCloudinaryUpload].some(
      (item) => !item
    )
  ) {
    throw new ApiError(404, "CoverImage or Avatar not uploaded to Cloudinary");
  }

  const userEntry = await User.create({
    fullName,
    avatar: checkAvatarCloudinaryUpload?.url,
    coverImage: checkCoverImageCloudinaryUpload?.url,
    email,
    password,
    username: username?.toLowerCase(),
  });
  const createdUser = await User.findById(userEntry?._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }
  console.log("Created User: ", createdUser);
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register Successfully"));
});

export { registerUser };
