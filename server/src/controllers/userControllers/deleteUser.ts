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
  if (!req.user || !req.user?._id)
    throw new ApiError(401, "UNAUTHENTICATED REQUEST");

  const userId = req.user._id;
  if (!isValidObjectId(userId)) throw new ApiError(400, "INVALID USER_ID");

  if (0) {
    const tweets = await Tweet.find({ owner: userId });
    const delTweets = await Tweet.deleteMany({ owner: userId });
    if (!tweets) throw new ApiError(404, "TWEETS NOT FOUND TO DELETE");

    const videos = await Video.find({ owner: userId });
    const delVideos = await Video.deleteMany({ owner: userId });
    if (!videos) throw new ApiError(404, "VIDEOS NOT FOUND");

    const playlist = await Playlist.find({ owner: userId });
    const delPlaylists = await Playlist.deleteMany({ owner: userId });
    if (!playlist) throw new ApiError(404, "PLAYLIST NOT FOUND");

    const likes = await Like.find({ likedBy: userId });
    const delLikes = await Like.deleteMany({ likedBy: userId });
    if (!likes) throw new ApiError(404, "LIKES NOT FOUND");

    const comments = await Comment.find({ owner: userId });
    const delComments = await Comment.deleteMany({ owner: userId });
    if (!comments) throw new ApiError(404, "COMMENTS NOT FOUND");

    const subscribers = await Subscription.find({ channel: userId });
    const delSubscribers = await Subscription.deleteMany({ channel: userId });
    if (!subscribers) throw new ApiError(404, "NO SUBSCRIBERS FOUND");

    const subbedTo = await Subscription.find({ subscriber: userId });
    const delSubbedTo = await Subscription.deleteMany({ subscriber: userId });
    if (!subbedTo) throw new ApiError(404, "NOT SUBBED TO ANYONE");

    const user = await User.findOne({ _id: userId });
    const delUser = await User.findOneAndDelete(userId);
    if (!user) throw new ApiError(404, "USER NOT FOUND");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "USER DELETED FROM THE DATABASE"));
});

export { deleteUser };

/*
import mongoose from "mongoose";
import {
  User,
  Like,
  Video,
  Comment,
  Playlist,
  Tweet,
  Subscription,
} from "../../models/index.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { deleteFromCloudinary } from "../../utils/cloudinary.js"; // implement separately

const deleteUser = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "UNAUTHENTICATED REQUEST");
  const userId = req.user._id;
  if (!isValidObjectId(userId)) throw new ApiError(400, "INVALID USER_ID");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch user first
    const user = await User.findById(userId).session(session);
    if (!user) throw new ApiError(404, "USER NOT FOUND");

    // Collect Cloudinary IDs before deleting
    const publicIds = [];
    if (user.avatarPublicId) publicIds.push(user.avatarPublicId);
    if (user.CoverImagePublicId) publicIds.push(user.CoverImagePublicId);

    const videos = await Video.find({ owner: userId }).session(session);
    videos.forEach(v => v.videoPublicId && publicIds.push(v.videoPublicId));

    // Parallel deletions
    const [
      tweets,
      videoRes,
      playlistRes,
      likeRes,
      commentRes,
      subsByRes,
      subsToRes,
      userRes,
    ] = await Promise.all([
      Tweet.deleteMany({ owner: userId }).session(session),
      Video.deleteMany({ owner: userId }).session(session),
      Playlist.deleteMany({ owner: userId }).session(session),
      Like.deleteMany({ likedBy: userId }).session(session),
      Comment.deleteMany({ owner: userId }).session(session),
      Subscription.deleteMany({ channel: userId }).session(session),
      Subscription.deleteMany({ subscriber: userId }).session(session),
      User.deleteOne({ _id: userId }).session(session),
    ]);

    // Commit DB deletions
    await session.commitTransaction();
    session.endSession();

    // Cleanup Cloudinary (after commit)
    if (publicIds.length > 0) await deleteFromCloudinary(publicIds);

    return res.status(200).json(
      new ApiResponse(200, {
        deleted: {
          tweets: tweets.deletedCount,
          videos: videoRes.deletedCount,
          playlists: playlistRes.deletedCount,
          likes: likeRes.deletedCount,
          comments: commentRes.deletedCount,
          subsAsChannel: subsByRes.deletedCount,
          subsAsViewer: subsToRes.deletedCount,
          user: userRes.deletedCount,
        },
      },
      "USER AND RELATED DATA DELETED")
    );

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, "USER DELETION FAILED", error.message);
  }
});

export { deleteUser };

*/
