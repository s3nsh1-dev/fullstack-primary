import mongoose, { Schema } from "mongoose";

const schema = {
  content: {
    type: String,
    required: true,
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: "Video",
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
};

const commentSchema = new mongoose.Schema(schema, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);
