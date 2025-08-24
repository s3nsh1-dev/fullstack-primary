import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const schema = {
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  videoFile: {
    type: String, // cloudinary url
    required: true,
  },
  videoPublicId: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String, // cloudinary url
    required: true,
  },
  thumbPublicId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
};

const videoSchema = new Schema(schema, { timestamps: true });

// plugins are reusable pieces of schema logic you add with .plugin().
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = model("Video", videoSchema);
