import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import ApiResponse from "../utils/ApiResponse";
import { Types } from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  if (
    [fullname, email, username, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "INCOMPLETE INPUT FIELDS BY USER");
  }
  const exitedUser = await User.findOne({
    $or: [{ username, email }],
  });
  if (exitedUser) throw new ApiError(409, "DUPLICATE DATA: USERNAME OR EMAIL");

  // read about this type casting
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const avatarLocalPath: string = files.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(404, "UPLOAD FAILED ON MULTER: AVATAR");
  }
  const checkAvatarCloudinaryUpload = await uploadOnCloudinary(avatarLocalPath);

  let coverImagePath: string = "";
  if (
    req.files &&
    Array.isArray(files.coverImage) &&
    files.coverImage.length > 0
  ) {
    coverImagePath = files.coverImage[0]?.path;
  }

  const checkCoverImageCloudinaryUpload =
    await uploadOnCloudinary(coverImagePath);

  if (
    [checkAvatarCloudinaryUpload, checkCoverImageCloudinaryUpload].some(
      (item) => !item
    )
  ) {
    throw new ApiError(
      404,
      "UPLOAD FAILED ON CLOUDINARY: COVER_IMAGE OR AVATAR"
    );
  }

  const userEntry = await User.create({
    fullname,
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
    throw new ApiError(500, "SOMETHING WENT WRONG WHILE REGISTERING USER");
  }
  console.log("Created User: ", createdUser);
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register Successfully"));
});

const generateAccessAndRefreshTokens = async (
  userId: string | Types.ObjectId
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  // find the user
  // password check
  // access and refresh token
  // send cookie
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const matchedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!matchedUser) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await matchedUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const matchedUserId: string = String(matchedUser._id);
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(matchedUserId);

  const loggedInUser = await User.findById(matchedUser._id).select(
    "-password -refreshToken"
  );

  // so that cookies are no modifiable in frontend
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // get the user from middleware and delete the accessToken
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "User not authenticated");
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

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export { registerUser, loginUser, logoutUser };
