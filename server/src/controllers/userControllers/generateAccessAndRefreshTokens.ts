import ApiError from "../../utils/ApiError";
import { User } from "../../models/user.model";
import { Types } from "mongoose";

export const generateAccessAndRefreshTokens = async (
  userId: string | Types.ObjectId
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const newAccessToken = await user.generateAccessToken();
    const newRefreshToken = await user.generateRefreshToken();

    // Mongoose marks the refreshToken field as "modified" after change.
    user.refreshToken = newRefreshToken;

    await user.save({ validateBeforeSave: false });

    return { newAccessToken, newRefreshToken };
  } catch (error: any) {
    throw new ApiError(
      500,
      error?.message ||
        "Something went wrong while generating refresh and access token"
    );
  }
};
