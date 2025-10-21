import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { Video } from "../models/video.model";
import { Tweet } from "../models/tweet.model";

const searchingText = asyncHandler(async (req, res) => {
  const { searchText } = req.params;

  if (!searchText || searchText.trim().length < 1)
    throw new ApiError(400, "Search text must be at least 1 character long");

  const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  // Run all queries in parallel
  const [searchUser, searchVideo, searchTweet] = await Promise.all([
    User.find({
      $or: [{ username: regex }, { fullname: regex }],
    }).select("username fullname avatar"),
    Video.find({ title: regex }).select("title thumbnail owner"),
    Tweet.find({ content: regex }).select("content author createdAt"),
  ]);

  // If all are empty, return no matches message
  if (
    searchUser.length === 0 &&
    searchVideo.length === 0 &&
    searchTweet.length === 0
  ) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { result: "No matching content found" },
          "Search results fetched successfully"
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: searchUser, video: searchVideo, tweet: searchTweet },
        "Search results fetched successfully"
      )
    );
});

export { searchingText };
