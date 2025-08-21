import mongoose from "mongoose";

const schema = {};
const commentSchema = new mongoose.Schema(schema, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);
