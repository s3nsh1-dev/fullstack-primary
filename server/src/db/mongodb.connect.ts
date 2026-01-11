import env from "../utils/dotenvHelper";
import mongoose from "mongoose";
import { DB_NAME } from "../constants";
import { logService } from "../services/logger.service";

const mongodbConnect = async () => {
  try {
    const dbConnection = await mongoose.connect(
      `${env.MONGODB_COMPASS_CONNECTION_STRING}/${DB_NAME}`
    );
    logService.info("mongoDB connected");
  } catch (error: any) {
    logService.info("mongoDB CONNECTION ERROR: ", error);
    process.exit(1);
  }
};

export default mongodbConnect;
