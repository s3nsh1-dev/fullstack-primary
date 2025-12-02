import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller";
import verifyJWT from "../middleware/auth.middleware";

const playlistRouter = Router();

playlistRouter.route("/").post(verifyJWT, createPlaylist);

playlistRouter
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(verifyJWT, updatePlaylist)
  .delete(verifyJWT, deletePlaylist);

playlistRouter
  .route("/add/:videoId/:playlistId")
  .patch(verifyJWT, addVideoToPlaylist);
playlistRouter
  .route("/remove/:videoId/:playlistId")
  .patch(verifyJWT, removeVideoFromPlaylist);

playlistRouter.route("/user/:userId").get(getUserPlaylists);

export default playlistRouter;
