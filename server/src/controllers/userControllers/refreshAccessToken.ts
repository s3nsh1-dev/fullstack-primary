import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import jwt from "jsonwebtoken";
import env from "../../utils/dotenvHelper";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";
import {
  accessTokenCookieOptions,
  csrfCookieName,
  csrfTokenCookieOptions,
  httpOptions,
  refreshTokenCookieOptions,
} from "../../constants";
import { generateAccessAndRefreshTokens } from "./generateAccessAndRefreshTokens";
import { compareRefreshToken } from "../../utils/refreshTokenSecurity";
import { generateCsrfToken } from "../../middleware/csrf.middleware";

export const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "NO REFRESH TOKEN FOUND");
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

    if (!user) {
      throw new ApiError(401, "INVALID REFRESH TOKEN");
    }

    if (user.isSuspended) {
      throw new ApiError(403, "USER ACCOUNT IS SUSPENDED");
    }

    if (user.isDeactivated) {
      throw new ApiError(403, "USER ACCOUNT IS DEACTIVATED");
    }

    const isRefreshTokenValid = await compareRefreshToken(
      incomingRefreshToken,
      user.refreshToken
    );

    if (!isRefreshTokenValid) {
      await User.findByIdAndUpdate(user._id, { $unset: { refreshToken: 1 } });
      throw new ApiError(401, "REFRESH TOKEN IS EXPIRED OR USED");
    }
    const { newAccessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(String(user._id));
    const csrfToken = generateCsrfToken();

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, accessTokenCookieOptions)
      .cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions)
      .cookie(csrfCookieName, csrfToken, csrfTokenCookieOptions)
      .json(new ApiResponse(200, { user }, "TOKENS CREDENTIAL REFRESHED"));
  } catch (error: unknown) {
    res.clearCookie("accessToken", httpOptions);
    res.clearCookie("refreshToken", httpOptions);
    res.clearCookie(csrfCookieName, csrfTokenCookieOptions);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(401, error.message);
    } else {
      throw new ApiError(401, `FAILED TO GENERATE REFRESH TOKEN`);
    }
  }
});
