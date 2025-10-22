
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // self-reference for nested replies
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isApproved: {
      type: Boolean,
      default: true, // admin can toggle this for moderation
    },
  },
  { timestamps: true }
);


commentSchema.pre("deleteOne", { document: true }, async function (next) {
  // Remove replies when a comment is deleted
  await mongoose.model("Comment").deleteMany({ _id: { $in: this.replies } });
  next();
});

export const Comment = mongoose.model("Comment", commentSchema);
