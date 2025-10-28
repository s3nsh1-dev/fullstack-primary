import env from "./utils/dotenvHelper";
import mongodbConnect from "./db/mongodb.connect";
import { app } from "./app";

const PORT = env.PORT;

export default async function serverMain() {
  try {
    // app.use  = used when using middleware and doing something with configurations
    // app.use(cors());
    // app.use(express.json());

    /*
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
      console.info(`🚀 Server running on http://localhost:${PORT}`)
    );

    // Handle server errors
    server.on("error", (err) => {
      console.error("❌ SERVER ERROR:", err);
    });
  } catch (error) {
    console.error("❌ STARTUP ERROR:", error);
    process.exit(1); // Exit if server cannot start properly
  }
    */
    await mongodbConnect()
      .then(() => {
        app.listen(PORT, () => {
          console.info(`⚙️  SERVER LIVE ON: http://localhost:${PORT}`);
        });
        app.on("error", () => {
          throw new Error("ERROR WHILE CONNECTING DATABASE");
        });
      })
      .catch((error) => {
        console.error("MONGODB CONNECTION ERROR: ", error);
      });
  } catch (error) {
    console.error("❌  SERVER ERROR: ", error);
  }
}

serverMain();
