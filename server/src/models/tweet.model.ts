import mongoose from "mongoose";

const schema = {};
const tweetSchema = new mongoose.Schema(schema, { timestamps: true });

export const Tweet = mongoose.model("Tweet", tweetSchema);
