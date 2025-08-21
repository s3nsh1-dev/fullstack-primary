import mongoose from "mongoose";

const schema = {
  subscriber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
};

const subscriptionSchema = new mongoose.Schema(schema, { timestamps: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
