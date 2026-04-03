import ApiError from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import env from "../utils/dotenvHelper";
import type { UserThisType } from "../constants/ModelTypes";
import isAccessPayloadCorrect from "../utils/checkPayloadType";
import { ensureCsrfRequestIsValid } from "./csrf.middleware";

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
    ensureCsrfRequestIsValid(req);

    // there needs to be cookie in postman to make this work
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "UNAUTHENTICATED REQUEST");

    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

    let user = null;
    if (
      isAccessPayloadCorrect(decodedToken) &&
      typeof decodedToken === "object" &&
      "_id" in decodedToken
    ) {
      user = await User.findById((decodedToken as jwt.JwtPayload)._id).select(
        "-password -refreshToken"
      );
    } else {
      throw new ApiError(400, "INVALID TOKEN");
    }

    if (!user) throw new ApiError(401, "INVALID ACCESS TOKEN");
    req.user = user;

    next();
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    const typedError = error as Error | undefined;
    throw new ApiError(401, typedError?.message || "INVALID ACCESS TOKEN");
  }
});

export default verifyJWT;
