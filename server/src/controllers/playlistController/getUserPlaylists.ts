import { isValidObjectId } from "mongoose";
import { Playlist } from "../../models/playlist.model";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { toObjectId } from "../../utils/convertToObjectId";

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (!isValidObjectId(userId)) throw new ApiError(400, "INVALID USER_ID");

  const playlists = await Playlist.aggregate([
    { $match: { owner: toObjectId(String(userId)) } },
    {
      $facet: {
        data: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "videos",
              localField: "videos",
              foreignField: "_id",
              as: "videos",
              pipeline: [
                { $project: projectVideos },
                {
                  $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [{ $project: projectOwner }],
                  },
                },
                {
                  $unwind: { path: "$owner", preserveNullAndEmptyArrays: true },
                },
              ],
            },
          },
          { $project: projectPlaylist },
        ],
        total: [{ $count: "total" }],
      },
    },
  ]);

  const totalDocs = playlists[0].total[0]?.total || 0;
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const havePrevPage = page > 1;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        playlists: playlists[0].data,
        length: playlists[0].data.length,
        totalPages,
        hasNextPage,
        havePrevPage,
        currentPage: page,
        limit,
      },
      "USER PLAYLISTS FETCHED SUCCESSFULLY"
    )
  );
});

export { getUserPlaylists };

const projectVideos = {
  title: 1,
  description: 1,
  thumbnail: 1,
  videoFile: 1,
  duration: 1,
  views: 1,
  isPublished: 1,
  updatedAt: 1,
  owner: 1,
};

const projectOwner = {
  _id: 1,
  avatar: 1,
  username: 1,
  fullname: 1,
};

const projectPlaylist = {
  name: 1,
  description: 1,
  videos: 1,
  owner: 1,
  updatedAt: 1,
  createdAt: 1,
};
