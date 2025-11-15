import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../../models/video.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

const getAllVideos = asyncHandler(async (req, res) => {
  // TODO: Extract and cast query params safely

  const { userId, page, limit, query, sortBy, sortType } =
    req.query as RequestQueryType;

  if (
    !page ||
    !limit ||
    page < 1 ||
    limit < 1 ||
    Number.isNaN(page) ||
    Number.isNaN(limit)
  ) {
    throw new ApiError(400, "INVALID PAGINATION PARAMETER");
  }
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "INVALID USER_ID");
  }

  // const matchStage: Record<string, any> = { isPublished: true };
  const matchStage: Record<string, any> = {};

  if (query) {
    matchStage.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (userId) {
    matchStage.owner = new mongoose.Types.ObjectId(userId);
  }
  // Sorting
  const sortStage: Record<string, 1 | -1> = {};

  const sortField = sortBy && sortBy.length > 0 ? sortBy : "createdAt";
  sortStage[sortField] = sortType === "asc" ? 1 : -1;

  const videoList = await Video.aggregate([
    { $match: matchStage },
    { $sort: sortStage },
    {
      $facet: {
        data: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $project: {
              title: 1,
              description: 1,
              videoFile: 1,
              thumbnail: 1,
              isPublished: 1,
              views: 1,
              duration: 1,
              createdAt: 1,
              updatedAt: 1,
              owner: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const videos = videoList[0]?.data || [];
  const totalVideos = videoList[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalVideos / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        totalVideos,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        currentPage: page,
        limit,
      },

      "VIDEOS FETCHED SUCCESSFULLY"
    )
  );
});

export { getAllVideos };

type RequestQueryType = {
  page?: number;
  limit?: number;
  query?: string;
  sortBy?: string;
  sortType?: string;
  userId?: string;
};
