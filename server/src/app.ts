import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./utils/dotenvHelper";
//routes import
import userRouter from "./routes/user.routes";
import videoRouter from "./routes/video.route";
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

// TAKE DATA FROM JSON BODY
app.use(
  express.json({
    limit: "16kb",
  })
);

//  I GUESS, SOME SITES TAKE PDF LESS THAN 50KB CAN BE SET BY THIS TYPE OF SYNTAX + MULER package
// TAKE DATA FROM URL
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// THE PLACE WHERE WE ARE KEEPING PUBLIC ACCESS ANYONE CAN USE IT <WE STORE IT HERE> SIMILAR TO THE PUBLIC > TEMP FOLDER WE ALREADY HAVE
app.use(express.static("public"));
// PERFORM CRUD OPERATION IN USER BROWSER LIKE ACCESS AND SETTING COOKIES FOR USER
app.use(cookieParser());

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);

export { app };
