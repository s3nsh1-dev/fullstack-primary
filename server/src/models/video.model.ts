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
  thumbnail: {
    type: String, // cloudinary url
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

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = model("Video", videoSchema);
