import express from "express";
import cors from "cors";
import env from "./utils/dotenvHelper";
import mongodbConnect from "./db/mongodb.connect";

const PORT = env.PORT;
const app = express();

export default async function serverMain() {
  try {
    app.use(cors());
    app.use(express.json());

    //DB connection
    await mongodbConnect();
    // Learned something new
    app.on("error", () => {
      throw new Error("ERROR WHILE CONNECTING DATABASE");
    });

    //Routes
    app.get("/", (req, res) => {
      res.send("Hello from TypeScript Server!");
    });

    // Start server
    const server = app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );

    // Handle server errors
    server.on("error", (err) => {
      console.error("❌ SERVER ERROR:", err);
    });
  } catch (error) {
    console.error("❌ STARTUP ERROR:", error);
    process.exit(1); // Exit if server cannot start properly
  }
}

serverMain();
