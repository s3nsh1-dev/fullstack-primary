import { isValidObjectId } from "mongoose";
import { Subscription } from "../../models/subscription.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

const getUserChannelSubscribersCount = asyncHandler(async (req, res) => {
  // TODO: controller to return subscriber list of a channel

  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "INVALID CHANNEL_ID");
  }

  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
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

  const skip = (page - 1) * limit;

  const [subscribers, totalSubscribers] = await Promise.all([
    Subscription.find({ channel: channelId })
      .populate({
        path: "subscriber",
        select: "fullname avatar username",
      })
      .select("subscriber channel createdAt")
      .limit(limit)
      .skip(skip),
    Subscription.countDocuments({ channel: channelId }),
  ]);

  const totalPages = Math.ceil(totalSubscribers / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribers,
        totalSubscribers,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        currentPage: page,
        limit,
      },
      "CHANNEL SUBSCRIBERS RETRIEVED SUCCESSFULLY"
    )
  );
});

export { getUserChannelSubscribersCount };
