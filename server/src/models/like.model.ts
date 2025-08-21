import mongoose from "mongoose";

const schema = {
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweet",
  },
  likedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
};
const likeSchema = new mongoose.Schema(schema, { timestamps: true });

export const Like = mongoose.model("Like", likeSchema);
