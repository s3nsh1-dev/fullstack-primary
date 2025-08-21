import mongoose from "mongoose";

const schema = {
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
};
const tweetSchema = new mongoose.Schema(schema, { timestamps: true });

export const Tweet = mongoose.model("Tweet", tweetSchema);
