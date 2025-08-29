import mongoose from "mongoose";

/*
User_A is subscribing to User_B ==then==>  A is subscriber and B is channel
so if i want to Unsubscribe User_B(Channel) from User_A(Subscriber).
I have to delete the document where subscriber is A and channel is B.
*/

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
