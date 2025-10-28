import env from "../utils/dotenvHelper";
import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const mongodbConnect = async () => {
  try {
    const dbConnection = await mongoose.connect(
      `${env.MONGODB_COMPASS_CONNECTION_STRING}/${DB_NAME}`
    );
    console.info("mongoDB connected");
  } catch (error) {
    console.info("mongoDB CONNECTION ERROR: ", error);
    process.exit(1);
  }
};

export default mongodbConnect;
