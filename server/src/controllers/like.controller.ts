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
    resultFindings = await Like.deleteOne({
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
    resultFindings = await Like.deleteOne({
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
    resultFindings = await Like.deleteOne({
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

const isTweetLiked = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) throw new ApiError(400, "INVALID TWEET ID");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  const isTweetLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        isTweetLiked ? true : false,
        "TWEET IS LIKED SUCCESSFULLY"
      )
    );
});

const isCommentLiked = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId))
    throw new ApiError(400, "INVALID COMMENT ID");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  const isCommentLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        isCommentLiked ? true : false,
        "COMMENT IS LIKED SUCCESSFULLY"
      )
    );
});

const isVideoLiked = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) throw new ApiError(400, "INVALID VIDEO ID");
  if (!req.user || !req.user._id)
    throw new ApiError(400, "UNAUTHENTICATED REQUEST");

  const isVideoLiked = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        isVideoLiked ? true : false,
        "VIDEO IS LIKED SUCCESSFULLY"
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

  /*
  const everyLikedTweet = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        tweet: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "tweet",
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
                    _id: 1,
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              _id: 1,
              owner: 1,
              content: 1,
              updatedAt: 1,
            },
          },
          { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        ],
      },
    },
    { $unwind: { path: "$tweet", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        tweet: 1,
        likedBy: 1,
        updatedAt: 1,
      },
    },
  ]);

  const everyLikedVideo = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
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
                    _id: 1,
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              _id: 1,
              owner: 1,
              title: 1,
              description: 1,
              thumbnail: 1,
              videoFile: 1,
              duration: 1,
              views: 1,
              updatedAt: 1,
            },
          },
          { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        ],
      },
    },
    { $unwind: { path: "$video", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        video: 1,
        likedBy: 1,
        updatedAt: 1,
      },
    },
  ]);

  const everyLikeCommentOnTweet = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        comment: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "comments",
        as: "comment",
        let: { commentId: "$comment" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$commentId"] },
              tweet: { $exists: true }, // This ensures we only get direct comments on tweets
              comment: { $exists: false }, // This ensures it's NOT a reply to another comment
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "tweets",
              localField: "tweet",
              foreignField: "_id",
              as: "tweet",
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
                          _id: 1,
                          fullname: 1,
                          username: 1,
                          avatar: 1,
                        },
                      },
                    ],
                  },
                },
                {
                  $unwind: {
                    path: "$owner",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: 1,
                    owner: 1,
                    content: 1,
                    createdAt: 1,
                    updatedAt: 1,
                  },
                },
              ],
            },
          },
          { $unwind: { path: "$tweet", preserveNullAndEmptyArrays: true } },
          { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        ],
      },
    },
    { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
    {
      $match: {
        comment: { $ne: null, $exists: true },
        "comment.tweet": { $exists: true }, // Ensures the comment has a tweet reference
      },
    },
    {
      $project: {
        _id: 1,
        comment: 1,
        likedBy: 1,
        updatedAt: 1,
      },
    },
  ]);

  const everyLikedCommentOnVideo = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        comment: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "comments",
        as: "comment",
        let: { commentId: "$comment" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$commentId"] },
              video: { $exists: true }, // This ensures we only get direct comments on videos
              comment: { $exists: false }, // This ensures it's NOT a reply to another comment
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "videos",
              localField: "video",
              foreignField: "_id",
              as: "video",
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
                          _id: 1,
                          fullname: 1,
                          username: 1,
                          avatar: 1,
                        },
                      },
                    ],
                  },
                },
                {
                  $unwind: { path: "$owner", preserveNullAndEmptyArrays: true },
                },
                {
                  $project: {
                    _id: 1,
                    owner: 1,
                    title: 1,
                    description: 1,
                    thumbnail: 1,
                    videoFile: 1,
                    duration: 1,
                    views: 1,
                    createdAt: 1,
                    updatedAt: 1,
                  },
                },
              ],
            },
          },
          { $unwind: { path: "$video", preserveNullAndEmptyArrays: true } },
          { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        ],
      },
    },
    { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
    {
      $match: {
        comment: { $ne: null, $exists: true },
        "comment.video": { $exists: true }, // Ensures the comment has a video reference
      },
    },
    {
      $project: {
        _id: 1,
        comment: 1,
        likedBy: 1,
        updatedAt: 1,
      },
    },
  ]);

  const everyLikeReplyOnCommentWithTweetAsContent = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        comment: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "comments",
        as: "comment",
        let: { commentId: "$comment" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$commentId"] },
              comment: { $exists: true }, // This ensures we only get replies to comments
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "comments",
              localField: "comment",
              foreignField: "_id",
              as: "comment",
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
                          _id: 1,
                          fullname: 1,
                          username: 1,
                          avatar: 1,
                        },
                      },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "tweets",
                    localField: "tweet",
                    foreignField: "_id",
                    as: "tweet",
                    pipeline: [
                      {
                        $project: {
                          _id: 1,
                          owner: 1,
                          content: 1,
                          updatedAt: 1,
                        },
                      },
                    ],
                  },
                },
                {
                  $unwind: {
                    path: "$tweet",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $unwind: {
                    path: "$owner",
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
            },
          },
          { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
          { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        ],
      },
    },
    { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
    // Add this match stage to filter out empty comments
    {
      $match: {
        comment: { $ne: null, $exists: true }, // Ensures comment exists and is not null
        "comment.comment": { $exists: true }, // Ensures it's a reply to a comment (not a direct tweet comment)
      },
    },
    {
      $project: {
        _id: 1,
        comment: 1,
        likedBy: 1,
        updatedAt: 1,
      },
    },
  ]);

  const everyLikeReplyOnCommentWithVideoAsContent = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        comment: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "comments",
        as: "comment",
        let: { commentId: "$comment" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$commentId"] },
              comment: { $exists: true }, // This ensures we only get replies to comments
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "comments",
              localField: "comment",
              foreignField: "_id",
              as: "comment",
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
                          _id: 1,
                          fullname: 1,
                          username: 1,
                          avatar: 1,
                        },
                      },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "video",
                    pipeline: [
                      {
                        $project: {
                          _id: 1,
                          owner: 1,
                          title: 1,
                          description: 1,
                          thumbnail: 1,
                          videoFile: 1,
                          duration: 1,
                          views: 1,
                          updatedAt: 1,
                        },
                      },
                    ],
                  },
                },
                {
                  $unwind: { path: "$video", preserveNullAndEmptyArrays: true },
                },
                {
                  $unwind: { path: "$owner", preserveNullAndEmptyArrays: true },
                },
              ],
            },
          },
          { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
          { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        ],
      },
    },
    { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
    {
      $match: {
        comment: { $ne: null, $exists: true }, // Ensures comment exists and is not null
        "comment.comment": { $exists: true }, // Ensures it's a reply to a comment (not a direct video comment)
      },
    },
    {
      $project: {
        _id: 1,
        comment: 1,
        likedBy: 1,
        updatedAt: 1,
      },
    },
  ]);
*/
  const [
    everyLikedTweet,
    everyLikedVideo,
    everyLikeCommentOnTweet,
    everyLikedCommentOnVideo,
    everyLikeReplyOnCommentWithTweetAsContent,
    everyLikeReplyOnCommentWithVideoAsContent,
  ] = await Promise.all([
    Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(userId),
          tweet: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "tweets",
          localField: "tweet",
          foreignField: "_id",
          as: "tweet",
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
                      _id: 1,
                      fullname: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: 1,
                owner: 1,
                content: 1,
                updatedAt: 1,
              },
            },
            { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
          ],
        },
      },
      { $unwind: { path: "$tweet", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          tweet: 1,
          likedBy: 1,
          updatedAt: 1,
        },
      },
    ]),
    Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(userId),
          video: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "video",
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
                      _id: 1,
                      fullname: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: 1,
                owner: 1,
                title: 1,
                description: 1,
                thumbnail: 1,
                videoFile: 1,
                duration: 1,
                views: 1,
                updatedAt: 1,
              },
            },
            { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
          ],
        },
      },
      { $unwind: { path: "$video", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          video: 1,
          likedBy: 1,
          updatedAt: 1,
        },
      },
    ]),
    Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(userId),
          comment: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "comments",
          as: "comment",
          let: { commentId: "$comment" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$commentId"] },
                tweet: { $exists: true }, // This ensures we only get direct comments on tweets
                comment: { $exists: false }, // This ensures it's NOT a reply to another comment
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      fullname: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "tweets",
                localField: "tweet",
                foreignField: "_id",
                as: "tweet",
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
                            _id: 1,
                            fullname: 1,
                            username: 1,
                            avatar: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $unwind: {
                      path: "$owner",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      owner: 1,
                      content: 1,
                      createdAt: 1,
                      updatedAt: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: { path: "$tweet", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
          ],
        },
      },
      { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          comment: { $ne: null, $exists: true },
          "comment.tweet": { $exists: true }, // Ensures the comment has a tweet reference
        },
      },
      {
        $project: {
          _id: 1,
          comment: 1,
          likedBy: 1,
          updatedAt: 1,
        },
      },
    ]),
    Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(userId),
          comment: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "comments",
          as: "comment",
          let: { commentId: "$comment" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$commentId"] },
                video: { $exists: true }, // This ensures we only get direct comments on videos
                comment: { $exists: false }, // This ensures it's NOT a reply to another comment
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      fullname: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
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
                            _id: 1,
                            fullname: 1,
                            username: 1,
                            avatar: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $unwind: {
                      path: "$owner",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      owner: 1,
                      title: 1,
                      description: 1,
                      thumbnail: 1,
                      videoFile: 1,
                      duration: 1,
                      views: 1,
                      createdAt: 1,
                      updatedAt: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: { path: "$video", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
          ],
        },
      },
      { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          comment: { $ne: null, $exists: true },
          "comment.video": { $exists: true }, // Ensures the comment has a video reference
        },
      },
      {
        $project: {
          _id: 1,
          comment: 1,
          likedBy: 1,
          updatedAt: 1,
        },
      },
    ]),
    Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(userId),
          comment: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "comments",
          as: "comment",
          let: { commentId: "$comment" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$commentId"] },
                comment: { $exists: true }, // This ensures we only get replies to comments
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      fullname: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "comments",
                localField: "comment",
                foreignField: "_id",
                as: "comment",
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
                            _id: 1,
                            fullname: 1,
                            username: 1,
                            avatar: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $lookup: {
                      from: "tweets",
                      localField: "tweet",
                      foreignField: "_id",
                      as: "tweet",
                      pipeline: [
                        {
                          $project: {
                            _id: 1,
                            owner: 1,
                            content: 1,
                            updatedAt: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $unwind: {
                      path: "$tweet",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $unwind: {
                      path: "$owner",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                ],
              },
            },
            { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
          ],
        },
      },
      { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
      // Add this match stage to filter out empty comments
      {
        $match: {
          comment: { $ne: null, $exists: true }, // Ensures comment exists and is not null
          "comment.comment": { $exists: true }, // Ensures it's a reply to a comment (not a direct tweet comment)
        },
      },
      {
        $project: {
          _id: 1,
          comment: 1,
          likedBy: 1,
          updatedAt: 1,
        },
      },
    ]),
    Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(userId),
          comment: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "comments",
          as: "comment",
          let: { commentId: "$comment" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$commentId"] },
                comment: { $exists: true }, // This ensures we only get replies to comments
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      fullname: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "comments",
                localField: "comment",
                foreignField: "_id",
                as: "comment",
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
                            _id: 1,
                            fullname: 1,
                            username: 1,
                            avatar: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $lookup: {
                      from: "videos",
                      localField: "video",
                      foreignField: "_id",
                      as: "video",
                      pipeline: [
                        {
                          $project: {
                            _id: 1,
                            owner: 1,
                            title: 1,
                            description: 1,
                            thumbnail: 1,
                            videoFile: 1,
                            duration: 1,
                            views: 1,
                            updatedAt: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $unwind: {
                      path: "$video",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $unwind: {
                      path: "$owner",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                ],
              },
            },
            { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
          ],
        },
      },
      { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          comment: { $ne: null, $exists: true }, // Ensures comment exists and is not null
          "comment.comment": { $exists: true }, // Ensures it's a reply to a comment (not a direct video comment)
        },
      },
      {
        $project: {
          _id: 1,
          comment: 1,
          likedBy: 1,
          updatedAt: 1,
        },
      },
    ]),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        everyLikedTweet,
        everyLikedVideo,
        everyLikeCommentOnTweet,
        everyLikedCommentOnVideo,
        everyLikeReplyOnCommentWithTweetAsContent,
        everyLikeReplyOnCommentWithVideoAsContent,
      },
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
  isTweetLiked,
  isCommentLiked,
  isVideoLiked,
};
