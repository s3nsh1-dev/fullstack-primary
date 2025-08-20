import { channel } from "diagnostics_channel";
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

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
