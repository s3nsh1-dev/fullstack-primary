import dotenv from "dotenv";
import type { Secret } from "jsonwebtoken";
import type { JwtTokenExpiryType } from "../constants/ModelTypes";

// Manual runtime validation of environment variables

dotenv.config();

type EnvVariableType = {
  PORT: string;
  MONGODB_COMPASS_CONNECTION_STRING: string;
  CORS_ORIGIN: string;
  // crucial Type casting to work with JWT
  ACCESS_TOKEN_SECRET: Secret;
  REFRESH_TOKEN_SECRET: Secret;
  ACCESS_TOKEN_EXPIRY: JwtTokenExpiryType;
  REFRESH_TOKEN_EXPIRY: JwtTokenExpiryType;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
};

const env: EnvVariableType = {
  PORT: process.env.PORT || "3001",
  MONGODB_COMPASS_CONNECTION_STRING:
    process.env.MONGODB_COMPASS_CONNECTION_STRING ||
    "mongodb://connection-string-not-found",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET || "fallback-access-token-secret",
  ACCESS_TOKEN_EXPIRY: (process.env.ACCESS_TOKEN_EXPIRY ||
    `1d`) as JwtTokenExpiryType,
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "fallback-refresh-token-secret",
  REFRESH_TOKEN_EXPIRY: (process.env.REFRESH_TOKEN_EXPIRY ||
    "10d") as JwtTokenExpiryType,
  CLOUDINARY_API_SECRET:
    process.env.CLOUDINARY_API_SECRET || "CLOUDINARY_API_SECRET_NOT_FOUND",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "0",
  CLOUDINARY_CLOUD_NAME:
    process.env.CLOUDINARY_CLOUD_NAME || "cloudinary_user_name",
};

export default env;
