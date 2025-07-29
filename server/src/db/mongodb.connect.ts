import env from "../utils/dotenvHelper";
import mongoose from "mongoose";

const mongodbConnect = async () => {
  try {
    const dbConnection = await mongoose.connect(
      env.MONGODB_COMPASS_CONNECTION_STRING
    );
    // console.log("mongoDB connected", dbConnection);
  } catch (error) {
    console.log("mongoDB CONNECTION ERROR: ", error);
    process.exit(1);
  }
};

export default mongodbConnect;
