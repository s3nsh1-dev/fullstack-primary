import mongoose, { Document } from "mongoose";

export interface UserThisType extends Document {
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  coverImage?: string;
  watchHistory?: mongoose.Types.ObjectId[];
  password: string;
  refreshToken?: string;
  isDeactivated: boolean;
  isAdmin: boolean;
  isSuspended: boolean;
  suspensionStart?: Date;
  suspensionEnd?: Date;
  suspensionReason?: string;
  suspendedBy?: mongoose.Types.ObjectId;

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
}

export type nextType = (err?: Error) => void;

export type JwtTokenExpiryType = `${number}${"s" | "m" | "h" | "d" | "y"}`;

export type UserStaleType = {
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  coverImage?: string;
  watchHistory?: mongoose.Types.ObjectId[];
  password?: string;
  refreshToken?: string;
  isDeactivated: boolean;
  isAdmin: boolean;
  isSuspended: boolean;
  suspensionStart?: Date;
  suspensionEnd?: Date;
  suspensionReason?: string;
  suspendedBy?: mongoose.Types.ObjectId;
};

export type Stats = {
  [key: string]: number;
  // Record<string, number>
};
