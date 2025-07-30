import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./utils/dotenvHelper";

const app = express();
/**
 * ABOUT CORS
 * What: Browser rule to control which sites can access your API.
 * Why: Prevent malicious sites from using your API with victim’s credentials.
 * Where: Implemented on backend servers.
 * When: Every time frontend and backend are on different domains/ports.
 * How: Server replies with <Access-Control-Allow-Origin> headers.
 * env.CORS_ORIGIN = string, Array[string1, string2] and function
 */
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
export { app };
