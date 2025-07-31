import mongoose from "mongoose";

const schema = {
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
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
  avatar: {
    type: String, // cloudinary url
    required: true,
  },
  coverImage: {
    type: String,
  },
  watchHistory: {
    // why ref is important ?
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  },
  password: {
    type: String,
    required: [true, "PASSWORD IN REQUIRED"],
  },
  refreshToken: {
    type: String,
  },
};

const userSchema = new mongoose.Schema({ schema }, { timestamps: true });
export const User = mongoose.model("User", userSchema);
