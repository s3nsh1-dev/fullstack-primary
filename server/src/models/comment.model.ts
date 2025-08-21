import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const schema = {
  content: {
    type: String,
    required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
};

const commentSchema = new mongoose.Schema(schema, { timestamps: true });

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);
