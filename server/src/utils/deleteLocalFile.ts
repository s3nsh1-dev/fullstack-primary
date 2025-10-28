import fs from "fs";
import path from "path";

/**
 * Delete a local file after successful upload to Cloudinary
 */
const deleteLocalFile = (filePath: string) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(path.resolve(filePath)); // remove the file
    }
  } catch (error) {
    console.error(`❌ Failed to delete local file: ${filePath}`, error);
  }
};

export default deleteLocalFile;
