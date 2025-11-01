import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { UserThisType, nextType } from "../constants/ModelTypes";
import env from "../utils/dotenvHelper";
import type { UserAccessTokenPayloadType } from "../constants";

const schema = {
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  avatar: { type: String },
  coverImage: { type: String },
  watchHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  password: {
    type: String,
    required: [true, "PASSWORD IN REQUIRED"],
  },
  refreshToken: {
    type: String,
    default: "",
  },
  avatarPublicId: { type: String },
  CoverImagePublicId: { type: String },
  isDeactivated: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  suspensionStart: { type: Date, default: null },
  suspensionEnd: { type: Date, default: null },
  suspensionReason: { type: String, default: "" },
  suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin ID
};

const userSchema = new mongoose.Schema(schema, { timestamps: true });

// want this to refer to Mongoose Document
async function passwordMiddlewareEncryption(
  this: UserThisType,
  next: nextType
) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next(new Error("PASSWORD IS MISSING"));

  this.password = await bcrypt.hash(this.password, 10);
  next(); // ✅ Everything is fine, go to the next middleware
}

// Non encrypted VS encrypted --> bcrypt encrypt the received string with same formula and compare
async function checkPasswordViaBcrypt(this: UserThisType, password: string) {
  return await bcrypt.compare(password, this.password);
}

async function jwtAccessToken(this: UserThisType) {
  // never share sensitive info as JWT itself is not encrypted
  const payload: UserAccessTokenPayloadType = {
    _id: String(this._id),
    email: this.email,
    username: this.username,
    fullname: this.fullname,
  };
  const secretOrPrivateKey = env.ACCESS_TOKEN_SECRET;
  const options = {
    expiresIn: env.ACCESS_TOKEN_EXPIRY,
  };

  return jwt.sign(payload, secretOrPrivateKey, options);
}

async function jwtRefreshToken(this: UserThisType) {
  return jwt.sign({ _id: this._id }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY,
  });
}

// Middleware like .pre() and .post() etc. are hooks that run before or after certain Mongoose actions.
userSchema.pre("save", passwordMiddlewareEncryption);
// Mongoose Methods are instance methods you call them for logic related to a single document (like checking a password, generating a token, etc.) here < User Model > is a single document
userSchema.methods.isPasswordCorrect = checkPasswordViaBcrypt;
userSchema.methods.generateAccessToken = jwtAccessToken;
userSchema.methods.generateRefreshToken = jwtRefreshToken;

// Mongoose automatically pluralizes and lowercases this name to create the collection name. if want to save in desired collection the give the name as 3rd parameter
export const User = mongoose.model<UserThisType>("User", userSchema);
