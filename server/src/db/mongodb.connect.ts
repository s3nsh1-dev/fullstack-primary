import env from "../utils/dotenvHelper";
import mongoose from "mongoose";

const mongodbConnect = async () => {
  try {
    const dbConnection = await mongoose.connect(
      `${env.MONGODB_COMPASS_CONNECTION_STRING}/${env.DB_NAME}`
    );
    console.info("mongoDB connected");
  } catch (error: any) {
    console.error("mongoDB CONNECTION ERROR: ", error);
    process.exit(1);
  }
};

export default mongodbConnect;
