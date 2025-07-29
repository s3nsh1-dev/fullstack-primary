import express from "express";
import cors from "cors";
import env from "./utils/dotenvHelper";
import mongodbConnect from "./db/mongodb.connect";

const PORT = env.PORT;
const app = express();

export default async function serverMain() {
  app.use(cors());
  app.use(express.json());

  //DB connection
  await mongodbConnect();

  app.get("/", (req, res) => {
    res.send("Hello from TypeScript Server!");
  });

  app.listen(PORT, () =>
    console.log(`Server running on port http://localhost:${PORT}`)
  );
}

serverMain();
