import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { isOwner } from "../utils/checkIsOwner";
import { toObjectId } from "../utils/convertToObjectId";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video

  const { videoId } = req.params;
  let responseMessage = "";
  let resultFindings;

  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID VIDEO_ID");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  // searching with videoId and user only give verified document
  const searchVideoLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });
  if (!searchVideoLike) {
    // No like then create like
    const createVideoLike = await Like.create({
      video: videoId,
      likedBy: req.user._id.toString(),
    });
    if (!createVideoLike) throw new ApiError(400, "FAILED TO CREATE LIKE");
    resultFindings = createVideoLike;
    responseMessage = "LIKE ADDED TO VIDEO";
  } else {
    resultFindings = await Like.findOneAndDelete({
      video: videoId,
      likedBy: req.user._id,
    });
    responseMessage = "LIKE REMOVED FROM VIDEO";
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result: resultFindings },
        `${responseMessage} SUCCESSFULLY`
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on comment

  const { commentId } = req.params;
  let responseMessage = "";
  let resultFindings;
  if (!isValidObjectId(commentId))
    throw new ApiError(400, "INVALID COMMENT ID");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  // double verification for loggedIn user <INTENTIONAL>
  const searchCommentLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });
  if (!searchCommentLike) {
    // No like then create like
    const createCommentLike = await Like.create({
      comment: commentId,
      likedBy: req.user._id.toString(),
    });
    if (!createCommentLike) throw new ApiError(400, "FAILED TO CREATE LIKE");
    resultFindings = createCommentLike;
    responseMessage = "LIKE ADDED TO COMMENT";
  } else {
    if (!isOwner(searchCommentLike.likedBy, req.user._id.toString())) {
      throw new ApiError(400, "USER NOT AUTHORIZED TO MAKE CHANGES");
    }
    resultFindings = await Like.findOneAndDelete({
      comment: commentId,
      likedBy: req.user._id,
    });
    responseMessage = "LIKE REMOVED FROM COMMENT";
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result: resultFindings },
        `${responseMessage} SUCCESSFULLY`
      )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on tweet

  const { tweetId } = req.params;
  let responseMessage = "";
  let resultFindings;

  if (!isValidObjectId(tweetId)) throw new ApiError(400, "INVALID TWEET ID");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  const searchTweetLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });
  if (!searchTweetLike) {
    // No like then create like
    const createTweetLike = await Like.create({
      tweet: tweetId,
      likedBy: req.user._id.toString(),
    });
    if (!createTweetLike) throw new ApiError(400, "FAILED TO CREATE LIKE");
    resultFindings = createTweetLike;
    responseMessage = "LIKE ADDED TO TWEET";
  } else {
    resultFindings = await Like.findOneAndDelete({
      tweet: tweetId,
      likedBy: req.user._id,
    });
    responseMessage = "LIKE REMOVED FROM TWEET";
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result: resultFindings },
        `${responseMessage} SUCCESSFULLY`
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHORIZED REQUEST");

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id.toString()),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              thumbnail: 1,
              duration: 1,
              views: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$videoDetails",
    },
    {
      $lookup: {
        from: "users",
        localField: "videoDetails.owner",
        foreignField: "_id",
        as: "videoOwner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    // {
    //   $addFields: {
    //     videoOwner: { $first: "$videoOwner" },
    //   },
    // },
    {
      $unwind: "$videoOwner",
    },
    {
      $project: {
        _id: 1,
        video: 1,
        likedBy: 1,
        videoDetails: 1,
        videoOwner: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!likedVideos) throw new ApiError(404, "LIKES NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes: likedVideos, length: likedVideos.length },
        "USER LIKED VIDEOS FETCHED SUCCESSFULLY"
      )
    );
});

const getLikedTweets = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHORIZED REQUEST");

  const likedTweets = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id.toString()),
        tweet: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "tweetDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              owner: 1,
              content: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$tweetDetails",
    },
    {
      $lookup: {
        from: "users",
        localField: "tweetDetails.owner",
        foreignField: "_id",
        as: "tweetOwner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        tweetOwner: { $first: "$tweetOwner" },
      },
    },
    {
      $project: {
        _id: 1,
        tweet: 1,
        likedBy: 1,
        tweetDetails: 1,
        tweetOwner: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!likedTweets) throw new ApiError(404, "LIKES NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes: likedTweets, length: likedTweets.length },
        "USER LIKED TWEETS FETCHED SUCCESSFULLY"
      )
    );
});

const getLikedComments = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHORIZED REQUEST");
  const userId = req.user._id as string;

  const likedComments = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        comment: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "comment",
        foreignField: "_id",
        as: "commentDetails",
      },
    },
    {
      $unwind: "$commentDetails",
    },
    {
      $lookup: {
        from: "users",
        localField: "commentDetails.owner",
        foreignField: "_id",
        as: "commentOwner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$commentOwner",
    },
    {
      $project: {
        _id: 1,
        comment: 1,
        likedBy: 1,
        commentDetails: 1,
        commentOwner: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!likedComments) throw new ApiError(404, "LIKES NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes: likedComments, length: likedComments.length },
        "USER LIKED VIDEOS FETCHED SUCCESSFULLY"
      )
    );
});

const getEveryLikedContent = asyncHandler(async (req, res) => {
  // TODO: get all liked videos/comments/tweets

  const { userId } = req.params;
  if (!isValidObjectId(userId)) throw new ApiError(400, "INVALID USER_ID");
  //   { $match: { likedBy: toObjectId(userId) } },
  //   {
  //     $lookup: {
  //       from: "videos",
  //       as: "video",
  //       localField: "video",
  //       foreignField: "_id",
  //       pipeline: [
  //         {
  //           $project: {
  //             title: 1,
  //             description: 1,
  //             videoFile: 1,
  //             thumbnail: 1,
  //             owner: 1,
  //             views: 1,
  //             duration: 1,
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "users",
  //             as: "owner",
  //             localField: "owner",
  //             foreignField: "_id",
  //             pipeline: [{ $project: { fullname: 1, avatar: 1 } }],
  //           },
  //         },
  //         { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
  //       ],
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "tweets",
  //       as: "tweet",
  //       localField: "tweet",
  //       foreignField: "_id",
  //       pipeline: [
  //         { $project: { content: 1, owner: 1 } },
  //         {
  //           $lookup: {
  //             from: "users",
  //             as: "owner",
  //             localField: "owner",
  //             foreignField: "_id",
  //             pipeline: [{ $project: { fullname: 1, avatar: 1 } }],
  //           },
  //         },
  //         {
  //           $unwind: { path: "$owner", preserveNullAndEmptyArrays: true },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "comments",
  //       as: "comment",
  //       localField: "comment",
  //       foreignField: "_id",
  //       pipeline: [
  //         {
  //           $project: {
  //             content: 1,
  //             video: 1,
  //             tweet: 1,
  //             owner: 1,
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "videos",
  //             as: "video",
  //             localField: "video",
  //             foreignField: "_id",
  //             pipeline: [
  //               { $project: { thumbnail: 1, title: 1, duration: 1, owner: 1 } },
  //               {
  //                 $lookup: {
  //                   from: "users",
  //                   as: "owner",
  //                   localField: "owner",
  //                   foreignField: "_id",
  //                   pipeline: [{ $project: { fullname: 1, avatar: 1 } }],
  //                 },
  //               },
  //               {
  //                 $unwind: { path: "$owner", preserveNullAndEmptyArrays: true },
  //               },
  //             ],
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "tweets",
  //             as: "tweet",
  //             localField: "tweet",
  //             foreignField: "_id",
  //             pipeline: [
  //               { $project: { content: 1, owner: 1 } },
  //               {
  //                 $lookup: {
  //                   from: "users",
  //                   as: "owner",
  //                   localField: "owner",
  //                   foreignField: "_id",
  //                   pipeline: [{ $project: { fullname: 1, avatar: 1 } }],
  //                 },
  //               },
  //               {
  //                 $unwind: { path: "$owner", preserveNullAndEmptyArrays: true },
  //               },
  //             ],
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "users",
  //             as: "owner",
  //             localField: "owner",
  //             foreignField: "_id",
  //             pipeline: [{ $project: { fullname: 1, avatar: 1 } }],
  //           },
  //         },
  //         { $unwind: { path: "$video", preserveNullAndEmptyArrays: true } },
  //         { $unwind: { path: "$tweet", preserveNullAndEmptyArrays: true } },
  //         { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
  //       ],
  //     },
  //   },

  //   // {
  //   // this add an empty array to all the LIKE document who lacks field like video, tweet and comment
  //   //   $addFields: {
  //   //     videoDetails: { $first: "$videoDetails" },
  //   //     comment: { $first: "$comment" },
  //   //     tweet: { $first: "$tweet" },
  //   //   },
  //   // },
  //   { $unwind: { path: "$video", preserveNullAndEmptyArrays: true } },
  //   { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
  //   { $unwind: { path: "$tweet", preserveNullAndEmptyArrays: true } },
  //   {
  //     $project: {
  //       likedBy: 1,
  //       comment: 1,
  //       video: 1,
  //       tweet: 1,
  //       updatedAt: 1,
  //     },
  //   },
  // ]);

  const likedContent = await Like.find({ likedBy: userId })
    .select("video tweet comment likedBy updatedAt")
    .populate({
      path: "video",
      select: "title description thumbnail videoFile owner views duration",
      populate: { path: "owner", select: "fullname avatar" },
    })
    .populate({
      path: "tweet",
      select: "content owner",
      populate: { path: "owner", select: "fullname avatar" },
    })
    .populate({
      path: "comment",
      select: "content video tweet owner",
      populate: [
        { path: "owner", select: "fullname avatar" },
        {
          path: "video",
          select: "title thumbnail duration owner",
          populate: { path: "owner", select: "fullname avatar" },
        },
        {
          path: "tweet",
          select: "content owner",
          populate: { path: "owner", select: "fullname avatar" },
        },
      ],
    });

  if (!likedContent) throw new ApiError(404, "LIKES NOT FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes: likedContent },
        "USER LIKED CONTENT FETCHED SUCCESSFULLY"
      )
    );
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  getLikedComments,
  getLikedTweets,
  getEveryLikedContent,
};
