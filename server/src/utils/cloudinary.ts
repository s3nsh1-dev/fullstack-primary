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

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // This is fine if deletion success/failure doesn’t affect the next step.
    // File deletion is handled in the background by the OS (non-blocking I/O),
    // so the Node.js event loop remains free to handle other tasks.
    fs.unlink(localFilePath).catch((error) => {
      console.log("SUCCESS: ISSUE IN FILE DELETION", error);
    });

    // console.log("LEARN CLOUDINARY RESPONSE: ", response);
    return response;
  } catch (error) {
    // await make sure to delete then proceed
    await fs.unlink(localFilePath).catch((error) => {
      console.log("FAILED: ISSUE IN FILE DELETION", error);
    });
    // console.log("ERROR WHILE UPLOADING TO CLOUDINARY: ", error);
  } finally {
    deleteLocalFile(localFilePath);
  }
};

export { uploadOnCloudinary };
