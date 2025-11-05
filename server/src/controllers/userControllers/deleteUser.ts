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

  const tweets = await Tweet.find({ content: userId });
  if (!tweets) throw new ApiError(404, "TWEETS NOT FOUND TO DELETE");

  const videos = await Video.find({ owner: userId });
  if (!videos) throw new ApiError(404, "VIDEOS NOT FOUND");

  const playlist = await Playlist.find({ owner: userId });
  if (!playlist) throw new ApiError(404, "PLAYLIST NOT FOUND");

  const likes = await Like.find({ likedBy: userId });
  if (!likes) throw new ApiError(404, "LIKES NOT FOUND");

  const comments = await Comment.find({ owner: userId });
  if (!comments) throw new ApiError(404, "COMMENTS NOT FOUND");

  const subscribers = await Subscription.find({ channel: userId });
  if (!subscribers) throw new ApiError(404, "NO SUBSCRIBERS FOUND");

  const subbedTo = await Subscription.find({ subscriber: userId });
  if (!subbedTo) throw new ApiError(404, "NOT SUBBED TO ANYONE");

  const user = await User.find({ _id: userId });
  if (!user) throw new ApiError(404, "USER NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          tweets,
          videos,
          playlist,
          likes,
          comments,
          subscribers,
          subbedTo,
          user,
        },
        "USER DELETED FROM THE DATABASE"
      )
    );
});

export { deleteUser };
