
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming you have a User model
      required: true,
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    coverImage: {
      type: String, // e.g., Cloudinary URL
      default: "",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Optional: text index for full-text search
postSchema.index({ title: "text", content: "text", tags: "text" });

export const Post = mongoose.model("Post", postSchema);
