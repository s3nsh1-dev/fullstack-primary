import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import jwt from "jsonwebtoken";
import env from "../../utils/dotenvHelper";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../../constants";
import { generateAccessAndRefreshTokens } from "./generateAccessAndRefreshTokens";
import { compareRefreshToken } from "../../utils/refreshTokenSecurity";

export const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "No Refresh Token founds");
    }
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      env.REFRESH_TOKEN_SECRET
    );
    let user = null;
    if (
      typeof decodedRefreshToken === "object" &&
      "_id" in decodedRefreshToken
    ) {
      user = await User.findById(
        (decodedRefreshToken as jwt.JwtPayload)?._id
      ).select("-password");
    } else {
      throw new ApiError(401, "INVALID REFRESH TOKEN");
    }
    const isRefreshTokenValid = await compareRefreshToken(
      incomingRefreshToken,
      user?.refreshToken
    );

    if (!isRefreshTokenValid) {
      throw new ApiError(401, "REFRESH TOKEN IS EXPIRED OR USED");
    }
    const { newAccessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(String(user?._id));

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, accessTokenCookieOptions)
      .cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions)
      .json(new ApiResponse(200, { user }, "TOKENS CREDENTIAL REFRESHED"));
  } catch (error: unknown) {
    // unknown + narrowing → best practice.

    if (error instanceof Error) {
      throw new ApiError(401, error.message);
    } else {
      throw new ApiError(401, `FAILED TO GENERATE REFRESH TOKEN`);
    }
  }
});
