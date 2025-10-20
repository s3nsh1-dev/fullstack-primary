import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { Video } from "../models/video.model";
import { Tweet } from "../models/tweet.model";
import { isValidObjectId } from "mongoose";

const searchingText = asyncHandler(async (req, res) => {
  const { userText } = req.params;
});

export { searchingText };
