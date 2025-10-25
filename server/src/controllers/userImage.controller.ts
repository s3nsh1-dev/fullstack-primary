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
import { toObjectId } from "../utils/convertToObjectId";

const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.user || !req?.user?._id)
    throw new ApiError(401, "UNAUTHORIZED REQUEST");
  const userId = req.user._id;
  const user = await User.findOne({ _id: userId });
  if (!user) throw new ApiError(404, "USER IS NOT AVAILABLE");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "AVATAR CHANGES SUCCESSFULLY"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  if (!req.user || !req?.user?._id)
    throw new ApiError(401, "UNAUTHORIZED REQUEST");
  const userId = req.user._id;
});

export { updateAvatar, updateCoverImage };
