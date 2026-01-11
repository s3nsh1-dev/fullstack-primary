import env from "./utils/dotenvHelper";
import mongodbConnect from "./db/mongodb.connect";
import { app } from "./app";
import { logService } from "./services/logger.service";

const PORT = env.PORT;

export default async function serverMain() {
  try {
    await mongodbConnect();
    app.listen(PORT, () => {
      logService.info(`⚙️  SERVER LIVE ON: http://localhost:${PORT}`);
    });
  } catch (error) {
    logService.error("❌  SERVER ERROR: ", error);
  }
}

serverMain();
