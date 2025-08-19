import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import ApiResponse from "../utils/ApiResponse";
import { Types } from "mongoose";
import { UserStaleType } from "../constants/ModelTypes";
import jwt from "jsonwebtoken";
import env from "../utils/dotenvHelper";
import { httpOptions as options } from "../constants";

const registerUser = asyncHandler(async (req, res) => {
  /**
   * Take user input <text inputs>
   * Check if user left any input empty
   * Check for existing user in the database
   * Take files from user <images in this case>
   */

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
    const newAccessToken = await user.generateAccessToken();
    const newRefreshToken = await user.generateRefreshToken();

    // Mongoose marks the refreshToken field as "modified" after change.
    user.refreshToken = newRefreshToken;

    await user.save({ validateBeforeSave: false });

    return { newAccessToken, newRefreshToken };
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
  const { newAccessToken, newRefreshToken } =
    await generateAccessAndRefreshTokens(matchedUserId);

  const loggedInUser: UserStaleType = matchedUser.toObject();
  // removing password and refreshToken field from the User data
  delete loggedInUser.password;
  delete loggedInUser.refreshToken;

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // get the user from middleware and delete the refreshToken
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

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "No Refresh Token founds");
    }
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      env.REFRESH_TOKEN_SECRET
    );
    let user = null;
    if (
      typeof decodedRefreshToken === "object" &&
      "_id" in decodedRefreshToken
    ) {
      user = await User.findById(
        (decodedRefreshToken as jwt.JwtPayload)?._id
      ).select("--password");
    } else {
      throw new ApiError(401, "INVALID REFRESH TOKEN");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "REFRESH TOKEN IS EXPIRED OR USED");
    }
    const { newAccessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(String(user?._id));
  } catch (error) {}
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
