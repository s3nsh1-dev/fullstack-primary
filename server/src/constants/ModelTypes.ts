import mongoose, { Document } from "mongoose";

export interface UserThisType extends Document {
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  coverImage?: string;
  watchHistory?: mongoose.Types.ObjectId;
  password: string;
  refreshToken?: string;
}

export type nextType = (err?: Error) => void;

export type JwtTokenExpiryType = `${number}${"s" | "m" | "h" | "d" | "y"}`;
