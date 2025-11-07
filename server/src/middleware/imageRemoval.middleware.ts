import { v2 as cloudinary } from "cloudinary";
import ApiError from "../utils/ApiError";

const deleteCloudinaryFileBasedOnPublicId = async (mediaPublicId: string) => {
  if (!mediaPublicId)
    throw new ApiError(404, "NO PUBLIC-ID FOR SHARED MEDIA FOUND");

  const isVideo =
    mediaPublicId.includes("/video/") ||
    mediaPublicId.match(/\.(mp4|mov|avi|mkv)$/i);

  const resourceType = isVideo ? "video" : "image";

  try {
    const result = await cloudinary.uploader
      .destroy(mediaPublicId, {
        resource_type: resourceType,
      })
      .catch(() => null);
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new ApiError(500, "Failed to delete media from Cloudinary");
  }
};

export default deleteCloudinaryFileBasedOnPublicId;
