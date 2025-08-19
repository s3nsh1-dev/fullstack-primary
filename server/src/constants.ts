export const DB_NAME = "videotube_database";

// so that cookies are not modifiable in frontend
export const httpOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
};
