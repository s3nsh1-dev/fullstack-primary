export const DB_NAME = "videotube_database";

// so that cookies are not modifiable in frontend
export const httpOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
};

export type UserPayloadType = {
  _id: unknown;
  email: string;
  username: string;
  fullname: string;
};
