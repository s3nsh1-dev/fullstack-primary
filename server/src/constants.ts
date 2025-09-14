import type { CookieOptions } from "express";

export const DB_NAME = "videotube_database";

// so that cookies are not modifiable in frontend
export const httpOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "none",
  /*
  for production
  secure: true,
  sameSite: "strict" as const,
  */
};

export type UserAccessTokenPayloadType = {
  _id: string;
  email: string;
  username: string;
  fullname: string;
  iat?: number;
  exp?: number;
};
