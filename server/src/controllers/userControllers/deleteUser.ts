import { User } from "../../models/user.model";
import { Like } from "../../models/like.model";
import { Video } from "../../models/video.model";
import { Comment } from "../../models/comment.model";
import { Playlist } from "../../models/playlist.model";
import { Tweet } from "../../models/tweet.model";
import { Subscription } from "../../models/subscription.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { isValidObjectId } from "mongoose";

// design a middleware to delete user image/videos from cloudinary with the help of public_ID

const deleteUser = asyncHandler((req, res) => {
  if (!req?.user || !req?.user?._id)
    throw new ApiError(401, "UNAUTHENTICATED REQUEST");
  const userId = req.user._id;
});
export { deleteUser };
