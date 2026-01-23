import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./utils/dotenvHelper";
//routes import
import userRouter from "./routes/user.routes";
import videoRouter from "./routes/video.route";
import healthCheckRouter from "./routes/healthCheck.route";
import tweetRouter from "./routes/tweet.route";
import subscriptionRouter from "./routes/subscription.route";
import commentRouter from "./routes/comment.route";
import likeRouter from "./routes/like.route";
import playlistRouter from "./routes/playlist.route";
import dashboardRouter from "./routes/dashboard.route";
import HomeRouter from "./routes/homepage.route";
import feedRouter from "./routes/feed.route";
import viewRouter from "./routes/view.route";
import { contactRouter } from "./routes/contact.route";
import { searchUserTextRouter } from "./routes/searchUserText.route";
import { requestLogger } from "./middleware/requestLogger.middleware";

const app = express();

const allowedOrigins = env.CORS_ORIGIN?.split(",");

if (!allowedOrigins) {
  throw new Error("CORS_ORIGIN is not defined");
}

// middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(requestLogger);

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/health", healthCheckRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/homepage", HomeRouter);
app.use("/api/v1/feeds", feedRouter);
app.use("/api/v1/views", viewRouter);
app.use("/api/v1/search", searchUserTextRouter);
app.use("/api/v1/contact", contactRouter);

export { app };
