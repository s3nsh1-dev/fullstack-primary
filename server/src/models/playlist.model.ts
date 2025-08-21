import mongoose from "mongoose";

const schema = {};
const playlistSchema = new mongoose.Schema(schema, { timestamps: true });

export const Playlist = mongoose.model("Playlist", playlistSchema);
