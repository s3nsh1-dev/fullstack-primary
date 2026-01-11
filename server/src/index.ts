import env from "./utils/dotenvHelper";
import mongodbConnect from "./db/mongodb.connect";
import { app } from "./app";

const PORT = env.PORT;

export default async function serverMain() {
  try {
    await mongodbConnect();
    app.listen(PORT, () => {
      console.info(`⚙️  SERVER LIVE ON: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌  SERVER ERROR: ", error);
  }
}

serverMain();
