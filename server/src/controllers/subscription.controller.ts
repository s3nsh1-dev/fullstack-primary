import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model";
import { Subscription } from "../models/subscription.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { toObjectId } from "../utils/convertToObjectId";
import { isOwner } from "../utils/checkIsOwner";

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
    resultFindings = await Subscription.findByIdAndDelete(findChannelByID._id);
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

const getUserChannelSubscribersCount = asyncHandler(async (req, res) => {
  // TODO: controller to return subscriber list of a channel

  const { channelId } = req.params;
  if (!isValidObjectId(channelId))
    throw new ApiError(400, "INVALID CHANNEL_ID");

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: toObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberInfo",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelInfo",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        subscriberInfo: {
          $first: "$subscriberInfo",
        },
        channelInfo: {
          $arrayElemAt: ["$channelInfo", 0],
        },
      },
    },
  ]);
  if (!subscribers) throw new ApiError(404, "NO SUBSCRIBERS FOUND");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscribers, length: subscribers.length },
        "CHANNEL SUBSCRIBERS RETRIEVED SUCCESSFULLY"
      )
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  // TODO: controller to return channel list to which user has subscribed

  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "INVALID SUBSCRIBER_ID");
  }

  const channels = await Subscription.find({ subscriber: subscriberId })
    .populate("channel", "_id fullname avatar")
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

export {
  toggleSubscription,
  getUserChannelSubscribersCount,
  getSubscribedChannels,
};
