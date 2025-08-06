import { v2 as cloudinary } from "cloudinary";
import env from "./dotenvHelper";
import fs from "fs";

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
    // console.log("FILE HAS BEEN UPLOADED TO CLOUDINARY: ", response.url);
    fs.unlinkSync(localFilePath);
    console.log("LEARN CLOUDINARY RESPONSE: ", response);
    return response;
  } catch (error) {
    // remove the locally saved temp file as the upload operation got failed
    fs.unlinkSync(localFilePath);
    console.log("ERROR WHILE UPLOADING TO CLOUDINARY: ", error);
  }
};

export { uploadOnCloudinary };
