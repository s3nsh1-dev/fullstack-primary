import ApiError from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import env from "../utils/dotenvHelper";
import type { UserThisType } from "../constants/ModelTypes";

// Extend Express Request interface to include 'user'

declare global {
  namespace Express {
    interface Request {
      user?: UserThisType;
    }
  }
}

// the client sends the accessToken every time. The refreshToken is a fallback mechanism.
const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

    let user = null;
    if (typeof decodedToken === "object" && "_id" in decodedToken) {
      user = await User.findById((decodedToken as jwt.JwtPayload)._id).select(
        "-password -refreshToken"
      );
    }

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
export default verifyJWT;
