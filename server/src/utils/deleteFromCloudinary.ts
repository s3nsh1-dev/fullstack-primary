import { v2 as cloudinary } from "cloudinary";
import ApiError from "./ApiError";

export const deleteFromCloudinary = async (publicId?: string) => {
  if (!publicId) return;
  try {
    const deletedDetails = await cloudinary.uploader.destroy(publicId);
    return deletedDetails;
  } catch {
    throw new ApiError(500, "CLOUDINARY DELETION FAILED");
  }
};
