import mongoose from "mongoose";

const schema = {};
const likeSchema = new mongoose.Schema(schema, { timestamps: true });

export const Like = mongoose.model("Like", likeSchema);
