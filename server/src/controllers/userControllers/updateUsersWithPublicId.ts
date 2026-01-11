import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { User } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { Document } from "mongoose";
import { logService } from "../../services/logger.service";

export const updateUsersWithPublicId = asyncHandler(async (req, res) => {
  const users = (await User.find().select(
    "username avatar coverImage updatedAt CoverImagePublicId avatarPublicId"
  )) as IUser[];
  if (!users || users.length === 0) throw new ApiError(404, "NO USER FOUND");

  await Promise.all(users.map((user) => applyLogicOnIndividualUser(user)));

  const newlyFetchedUsers = await User.find().select(
    "username CoverImagePublicId avatarPublicId updatedAt"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { newlyFetchedUsers }, "USER INFO"));
});

async function applyLogicOnIndividualUser(user: IUser) {
  try {
    const publicIdCoverImage = extractPublicIdFromURL(user.coverImage);
    if (publicIdCoverImage) user.CoverImagePublicId = publicIdCoverImage;

    const publicIdAvatar = extractPublicIdFromURL(user.avatar);
    if (publicIdAvatar) user.avatarPublicId = publicIdAvatar;

    await user.save();
  } catch (e: unknown) {
    const err = e as Error;
    logService.error(`Failed for user: ${user.username}`, err.message);
  }
}

const extractPublicIdFromURL: (url: string) => string | null = (url) => {
  const match = url.match(/\/upload\/v\d+\/(.+?)\.[a-z]+$/);
  return match ? match[1] : null;
};

export interface IUser extends Document {
  username: string;
  avatar: string;
  coverImage: string;
  updatedAt: Date;
  avatarPublicId: string;
  CoverImagePublicId: string;
}
