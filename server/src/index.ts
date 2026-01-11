import env from "./utils/dotenvHelper";
import mongodbConnect from "./db/mongodb.connect";
import { app } from "./app";
const PORT = env.PORT;

import mongoose from "mongoose";

let server: any;

export default async function serverMain() {
  try {
    await mongodbConnect();
    server = app.listen(PORT, listeningMessage);
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("❌  SERVER ERROR: ", error);
  }
}

serverMain();

const listeningMessage = () => {
  console.info(`⚙️  SERVER LIVE ON: http://localhost:${PORT}`);
};

const gracefulShutdown = async (signal: string) => {
  console.info(`Received ${signal}. Starting graceful shutdown...`);

  const closeServer = () =>
    new Promise<void>((resolve) => {
      if (server) {
        server.close(() => {
          console.info("HTTP server closed.");
          resolve();
        });
      } else {
        resolve();
      }
    });

  try {
    await closeServer();
    await mongoose.connection.close(false);
    console.info("MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection", error);
    process.exit(1);
  }
};
