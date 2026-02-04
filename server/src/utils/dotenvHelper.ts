import dotenv from "dotenv";
import type { Secret } from "jsonwebtoken";
import type { JwtTokenExpiryType } from "../constants/ModelTypes";

dotenv.config();

type EnvVariableType = {
  PORT: string;
  MONGODB_COMPASS_CONNECTION_STRING: string;
  DB_NAME: string;
  CORS_ORIGIN: string;
  NODE_ENV: string;
  // crucial Type casting to work with JWT
  ACCESS_TOKEN_SECRET: Secret;
  REFRESH_TOKEN_SECRET: Secret;
  ACCESS_TOKEN_EXPIRY: JwtTokenExpiryType;
  REFRESH_TOKEN_EXPIRY: JwtTokenExpiryType;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
  // configuration for nodemailer and winston
  GMAIL_SMTP_HOST: string;
  GMAIL_SMTP_PORT: number;
  GMAIL_SMTP_SECURE: boolean;
  GMAIL_PASSWORD: string;
  GMAIL_AUTH_USER_PROVIDER: string;
  RECIPIENT_MAIL_ID: string;
  LOG_LEVEL: string;
  // configuration for HTTP email provider
  EMAIL_PROVIDER_API_KEY: string;
  EMAIL_PROVIDER_API_URL: string;
  EMAIL_FROM_ADDRESS: string;
};

const env: EnvVariableType = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "3001",
  MONGODB_COMPASS_CONNECTION_STRING:
    process.env.MONGODB_COMPASS_CONNECTION_STRING ||
    "mongodb://connection-string-not-found",
  DB_NAME: process.env.DB_NAME || "incorrect-db-name",
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
  // configuration for nodemailer and winston
  GMAIL_SMTP_HOST: process.env.GMAIL_SMTP_HOST || "",
  GMAIL_SMTP_PORT: Number(process.env.GMAIL_SMTP_PORT) || 123,
  GMAIL_SMTP_SECURE: process.env.GMAIL_SMTP_SECURE === "true",
  GMAIL_AUTH_USER_PROVIDER: process.env.GMAIL_AUTH_USER_PROVIDER || "",
  GMAIL_PASSWORD: String(process.env.GMAIL_PASSWORD),
  RECIPIENT_MAIL_ID: process.env.RECIPIENT_MAIL_ID || "",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  // configuration for HTTP email provider
  EMAIL_PROVIDER_API_KEY: process.env.EMAIL_PROVIDER_API_KEY || "",
  EMAIL_PROVIDER_API_URL:
    process.env.EMAIL_PROVIDER_API_URL || "https://api.resend.com/emails",
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || "",
};

export default env;
