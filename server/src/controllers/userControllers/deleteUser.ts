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

/**
 * delete tweets
 * delete videos
 * delete playlists
 * delete likes on videos/comment/tweets
 * delete comments on comments/videos/tweets
 * delete list of channels i have subbed to
 * delete list of subscriber i have
 * delete user
 * delete Uploaded content via middleware
 * also clear the cookies if User / do not when Admin
 */

const deleteUser = asyncHandler(async (req, res) => {
  if (!req?.user || !req?.user?._id)
    throw new ApiError(401, "UNAUTHENTICATED REQUEST");
  const userId = req.user._id;
  if (!isValidObjectId(userId)) throw new ApiError(400, "INVALID USER_ID");
  const tweets = await User.find({ owner: userId });
  if (!tweets) throw new ApiError(404, "TWEETS NOT FOUND TO DELETE");

  return res
    .status(200)
    .json(new ApiResponse(200, { tweets }, "USER DELETED FROM THE DATABASE"));
});

export { deleteUser };
