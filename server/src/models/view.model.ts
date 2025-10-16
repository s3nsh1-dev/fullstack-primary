import mongoose from "mongoose";

const viewSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true, // Add index for faster queries
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      sparse: true, // Allow null values but index non-null
    },
    fingerprint: {
      type: String,
      required: true,
      index: true, // Add index for duplicate check
    },
    ipAddress: {
      type: String,
      required: true,
    },
    watchTime: {
      type: Number,
      required: true,
    },
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient duplicate checking
viewSchema.index({ videoId: 1, fingerprint: 1, createdAt: -1 });

// TTL index - auto-delete documents after 30 days
viewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export const View = mongoose.model("View", viewSchema);
