import { User } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import mongoose from "mongoose";

const getWatchHistory = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "UNAUTHENTICATED USER");

  const userId = req.user._id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const agg = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(String(userId)) } },

    // Add total count
    {
      $addFields: {
        total: { $size: "$watchHistory" },
      },
    },

    // Slice the array correctly BEFORE lookup
    {
      $project: {
        total: 1,
        watchHistory: {
          $slice: ["$watchHistory", skip, limit],
        },
      },
    },

    // Lookup videos in the same order
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "videos",
      },
    },

    // Preserve array order
    {
      $addFields: {
        videos: {
          $map: {
            input: "$watchHistory",
            as: "id",
            in: {
              $first: {
                $filter: {
                  input: "$videos",
                  as: "v",
                  cond: { $eq: ["$$v._id", "$$id"] },
                },
              },
            },
          },
        },
      },
    },

    // Populate owner inside videos
    {
      $lookup: {
        from: "users",
        localField: "videos.owner",
        foreignField: "_id",
        as: "owners",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
              coverImage: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        videos: {
          $map: {
            input: "$videos",
            as: "vid",
            in: {
              _id: "$$vid._id",
              title: "$$vid.title",
              description: "$$vid.description",
              videoFile: "$$vid.videoFile",
              thumbnail: "$$vid.thumbnail",
              duration: "$$vid.duration",
              views: "$$vid.views",
              isPublished: "$$vid.isPublished",
              createdAt: "$$vid.createdAt",
              updatedAt: "$$vid.updatedAt",
              owner: {
                $first: {
                  $filter: {
                    input: "$owners",
                    as: "o",
                    cond: { $eq: ["$$o._id", "$$vid.owner"] },
                  },
                },
              },
            },
          },
        },
      },
    },

    // Final cleanup
    {
      $project: {
        watchHistory: 0,
        owners: 0,
      },
    },
  ]);

  const result = agg[0] || { videos: [], total: 0 };

  return res.json(
    new ApiResponse(
      200,
      {
        total: result.total,
        page,
        limit,
        data: result.videos,
      },
      "WATCH HISTORY PAGINATED SUCCESSFULLY"
    )
  );
});

export { getWatchHistory };

interface VideoOwner {
  _id: string;
  username: string;
  fullname: string;
  avatar: string; // URL string
}

interface PopulatedVideo {
  _id: string;
  owner: VideoOwner; // The owner field is now the detailed object
  videoFile: string; // URL string
  thumbnail: string; // URL string
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
