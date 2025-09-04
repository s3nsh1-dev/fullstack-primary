export const DB_NAME = "videotube_database";

// so that cookies are not modifiable in frontend
export const httpOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
};

export type UserAccessTokenPayloadType = {
  _id: string; // should not be unknown, it's a string in your token
  email: string;
  username: string;
  fullname: string;
  iat?: number;
  exp?: number;
};
