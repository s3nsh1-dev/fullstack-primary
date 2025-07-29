import env from "../utils/dotenvHelper";
import mongoose from "mongoose";

const mongodbConnect = async () => {
  try {
    const DbConnection = await mongoose.connect(
      env.MONGODB_COMPASS_CONNECTION_STRING
    );
    console.log("mongoDB connected");
  } catch (error) {
    console.log("mongoDB Connection Error: ", error);
    process.exit(1);
  }
};

export default mongodbConnect;
