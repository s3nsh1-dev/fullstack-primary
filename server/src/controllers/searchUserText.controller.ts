import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { Video } from "../models/video.model";
import { Tweet } from "../models/tweet.model";
import { title } from "process";

const searchingText = asyncHandler(async (req, res) => {
  const { searchText } = req.params;
  if (!searchText || searchText.trim().length < 1)
    throw new ApiError(
      400,
      "UserText IS NOT VALID USERNAME/FULLNAME OR VIDEO OR TWEET TITLE"
    );
  const searchUser = await User.find({
    $or: [{ username: searchText }, { fullname: searchText }],
  });
  const searchVideo = await Video.find({
    title: title.match(searchText),
  });
  const searchTweet = await Tweet.find({ content: content.match(searchText) });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { searchUser, searchVideo, searchTweet },
        "FINDING FOR SEARCHED TEXT"
      )
    );
});

export { searchingText };
