import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import jwt from "jsonwebtoken";
import env from "../utils/dotenvHelper";
import deleteLocalFile from "../utils/deleteLocalFile";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import mongoose, { Types } from "mongoose";
import { UserStaleType } from "../constants/ModelTypes";
import { httpOptions as options } from "../constants";
import { isValidObjectId } from "mongoose";

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
    .json(new ApiResponse(200, createdUser, "USER REGISTERED SUCCESSFULLY"));
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
  } catch (error: any) {
    throw new ApiError(
      500,
      error?.message ||
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
    throw new ApiError(400, "USERNAME OR EMAIL IS REQUIRED");
  }

  const matchedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!matchedUser) {
    throw new ApiError(404, "USER DOES NOT EXIST");
  }

  const isPasswordValid = await matchedUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "USER PASSWORD IS INCORRECT");
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
          loggedIn: true,
        },
        "USER LOGGED IN SUCCESSFULLY"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
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
      ).select("-password");
    } else {
      throw new ApiError(401, "INVALID REFRESH TOKEN");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "REFRESH TOKEN IS EXPIRED OR USED");
    }
    const { newAccessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(String(user?._id));

    // intentionally not sharing token explicitly as JSON body
    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { user }, "TOKENS CREDENTIAL REFRESHED"));
  } catch (error: unknown) {
    // unknown + narrowing → best practice.

    if (error instanceof Error) {
      throw new ApiError(401, error.message);
    } else {
      throw new ApiError(401, `FAILED TO GENERATE REFRESH TOKEN`);
    }
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, " CURRENT PASSWORD AND NEW PASSWORD ARE REQUIRED");
  }

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }

  const user = await User.findById(req?.user._id);
  if (!user) {
    throw new ApiError(404, "USER NOT FOUND");
  }

  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, " INVALID CURRENT PASSWORD");
  }

  user.password = newPassword;
  await user.save({ validateModifiedOnly: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "PASSWORD CHANGED SUCCESSFULLY"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, "CURRENT USER RETRIEVED"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email, fullname } = req.body;

  if (!email && !fullname) {
    throw new ApiError(400, "EMAIL OR NAME IS REQUIRED");
  }

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }

  const user = await User.findByIdAndUpdate(
    req?.user._id,
    {
      $set: { fullname, email },
    },
    { new: true }
  ).select("-password ");
  if (!user) {
    throw new ApiError(404, "USER NOT FOUND");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user }, "ACCOUNT DETAILS UPDATED SUCCESSFULLY")
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "AVATAR FILE IS REQUIRED");
  }
  const avatarLocalPath: string = req.file.path;

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar || !avatar.url) {
    throw new ApiError(404, "UPLOAD FAILED ON CLOUDINARY: AVATAR");
  }

  deleteLocalFile(avatarLocalPath);

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }
  const updatedUser = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!updatedUser) throw new ApiError(404, "USER NOT FOUND");

  updatedUser.avatar = avatar.url;
  const userWithNewAvatar = await updatedUser.save();
  if (!userWithNewAvatar) {
    throw new ApiError(404, "USER IS NOT UPDATED WITH AVATAR");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: userWithNewAvatar },
        "AVATAR UPDATED SUCCESSFULLY"
      )
    );
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "COVER FILE IS REQUIRED");
  }
  const coverImageLocalPath: string = req.file.path;

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage || !coverImage.url) {
    throw new ApiError(400, "UPLOAD FAILED ON CLOUDINARY: COVER IMAGE");
  }

  // cleanup local file after upload (success or fail)
  deleteLocalFile(coverImageLocalPath);

  if (!req?.user || !req.user?._id) {
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "USER IS NOT UPDATED WITH COVER IMAGE");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "COVER IMAGE UPDATED SUCCESSFULLY"
      )
    );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username || !username?.trim()) {
    throw new ApiError(400, "USERNAME NOT FOUND");
  }

  const channel = await User.aggregate([
    {
      $match: { username: username?.toLowerCase() },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req?.user?._id, "$subscribers.subscriber"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscriberCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel || !channel?.length) {
    throw new ApiError(400, "CHANNEL DOES NOT EXIST");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: channel[0] },
        "USER CHANNEL FETCHED SUCCESSFULLY"
      )
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }

  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id.toString()),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);
  if (!user) throw new ApiError(404, "USER NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { watchHistory: user[0].watchHistory },
        "USER WATCH_HISTORY FETCHED SUCCESSFULLY"
      )
    );
});

const fetchUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "INVALID USER ID");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "USER NOT FOUND");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "USER FETCHED SUCCESSFULLY"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  fetchUserById,
};
