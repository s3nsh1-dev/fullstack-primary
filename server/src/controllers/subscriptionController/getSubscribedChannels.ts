import { isValidObjectId } from "mongoose";
import { Subscription } from "../../models/subscription.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

const getSubscribedChannels = asyncHandler(async (req, res) => {
  // TODO: controller to return channel list to which user has subscribed

  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "INVALID SUBSCRIBER_ID");
  }

  const channels = await Subscription.find({ subscriber: subscriberId })
    .populate("channel", "_id fullname avatar username")
    .exec();
  if (!channels) throw new ApiError(404, "NO CHANNELS FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { channels, length: channels.length },
        "SUBSCRIBED CHANNELS RETRIEVED SUCCESSFULLY"
      )
    );
});

export { getSubscribedChannels };
