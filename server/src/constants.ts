import type { CookieOptions } from "express";
import env from "./utils/dotenvHelper";

export const httpOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

export type UserAccessTokenPayloadType = {
  _id: string;
  email: string;
  username: string;
  fullname: string;
  iat?: number;
  exp?: number;
};
