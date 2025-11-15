import { isValidObjectId } from "mongoose";
import { Subscription } from "../../models/subscription.model";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { isOwner } from "../../utils/checkIsOwner";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription

  const { channelId } = req.params;
  let responseMessage = "";
  let resultFindings;

  if (!req.user || !req.user._id) throw new ApiError(401, "UNAUTHORIZED USER");
  const subscriberId = req.user._id;
  if (!isValidObjectId(channelId) || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "INVALID CHANNEL_ID OR SUBSCRIBER_ID");
  }

  const findChannelByID = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId,
  });
  if (!findChannelByID) {
    const createSubDocument = await Subscription.create({
      channel: channelId,
      subscriber: subscriberId,
    });
    if (!createSubDocument)
      throw new ApiError(500, "SUBSCRIPTION CREATION FAILED");
    resultFindings = createSubDocument;
    responseMessage = "SUBSCRIPTION CREATED";
  } else {
    if (!isOwner(findChannelByID.subscriber, req.user._id.toString())) {
      throw new ApiError(400, " USER NOT AUTHORIZED TO MAKE CHANGES");
    }
    resultFindings = await Subscription.deleteOne({
      channel: channelId,
      subscriber: subscriberId,
    });
    responseMessage = "SUBSCRIPTION REMOVED";
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

export { toggleSubscription };
