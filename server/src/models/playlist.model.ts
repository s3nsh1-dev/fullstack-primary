import mongoose from "mongoose";

const schema = {
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
};
const playlistSchema = new mongoose.Schema(schema, { timestamps: true });

export const Playlist = mongoose.model("Playlist", playlistSchema);
