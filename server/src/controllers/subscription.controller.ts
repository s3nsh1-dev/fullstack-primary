import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model";
import { Subscription } from "../models/subscription.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription

  const { channelId } = req.params;
  if (!req.user || !req.user._id) throw new ApiError(401, "UNAUTHORIZED USER");
  const subscriberId = req.user._id;
  if (!isValidObjectId(channelId) || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "INVALID CHANNEL_ID OR SUBSCRIBER_ID");
  }

  let resultFindings;
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
  } else {
    resultFindings = await Subscription.findByIdAndDelete(findChannelByID._id);
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { result: resultFindings },
        "Successfully Subscription Toggled"
      )
    );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  // TODO: controller to return subscriber list of a channel

  const { channelId } = req.params;
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  // TODO: controller to return channel list to which user has subscribed

  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
