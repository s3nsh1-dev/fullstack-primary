import { v2 as cloudinary } from "cloudinary";
import env from "./dotenvHelper";
import { promises as fs } from "fs";
import deleteLocalFile from "./deleteLocalFile";

/**
 * We can see the CLOUDINARY info like
 * CLOUDINARY_URL=cloudinary://my_key:my_secret@my_cloud_name
 * OR like below
 */
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (
  localFilePath: string,
  folderName: string = "general"
) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folderName,
    });
    fs.unlink(localFilePath).catch((error) => {
      console.info("SUCCESS: ISSUE IN FILE DELETION", error);
    });
    return response;
  } catch (error) {
    await fs.unlink(localFilePath).catch((error) => {
      console.info("FAILED: ISSUE IN FILE DELETION", error);
    });
  }
};

export { uploadOnCloudinary };
