// to check weather the owner _id and the _id we get from req.user is same or notDeepEqual// utils/ownership.ts

import { Types } from "mongoose";

export const isOwner = (
  owner: Types.ObjectId,
  userId: string | Types.ObjectId
) => owner.toString() === String(userId);
