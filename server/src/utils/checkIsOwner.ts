// to check whether the owner _id and the _id we get from req.user is same or not

import { Types } from "mongoose";

export const isOwner = (
  owner: Types.ObjectId,
  userId: string | Types.ObjectId
) => {
  try {
    return owner.toString() === String(userId);
  } catch {
    throw new Error("INVALID OWNER ID OR USER ID");
  }
};
