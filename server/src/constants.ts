import type { CookieOptions } from "express";
import env from "./utils/dotenvHelper";

export const accessTokenMaxAgeMs = 15 * 60 * 1000;
export const refreshTokenMaxAgeMs = 7 * 24 * 60 * 60 * 1000;
export const csrfCookieName = "csrfToken";
export const csrfHeaderName = "X-CSRF-Token";
export const allowedOrigins = (
  env.CORS_ORIGIN ? env.CORS_ORIGIN.split(",") : []
)
  .map((origin) => origin.trim())
  .filter(Boolean);

export const httpOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

export const accessTokenCookieOptions: CookieOptions = {
  ...httpOptions,
  maxAge: accessTokenMaxAgeMs,
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...httpOptions,
  maxAge: refreshTokenMaxAgeMs,
};

export const csrfTokenCookieOptions: CookieOptions = {
  ...httpOptions,
  httpOnly: false,
  maxAge: refreshTokenMaxAgeMs,
};

export type UserAccessTokenPayloadType = {
  _id: string;
  email: string;
  username: string;
  fullname: string;
  iat?: number;
  exp?: number;
};
