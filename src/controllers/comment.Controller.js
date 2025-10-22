
import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";
import redisClient from "../config/redis.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  if (!text) throw new ApiError(400, "Comment text is required");

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const comment = await Comment.create({
    text,
    user: req.user._id,
    post: postId,
  });

 
  await redisClient.del(`comments:post:${postId}`);

  res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

export const getCommentsByPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  //  Try to get comments from Redis cache first
  const cachedComments = await redisClient.get(`comments:post:${postId}`);

  if (cachedComments) {
    return res.status(200).json(
      new ApiResponse(
        200,
        JSON.parse(cachedComments),
        "Comments fetched successfully (from cache)"
      )
    );
  }


  const comments = await Comment.find({ post: postId, isApproved: true })
    .populate("user", "name email")
    .populate("replies")
    .sort({ createdAt: -1 });

  await redisClient.setEx(`comments:post:${postId}`, 600, JSON.stringify(comments));

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});


export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const comment = await Comment.findById(id);
  if (!comment) throw new ApiError(404, "Comment not found");

  if (comment.user.toString() !== req.user._id.toString())
    throw new ApiError(403, "You can only update your own comments");

  comment.text = text || comment.text;
  await comment.save();

  //  Invalidate cache for post comments
  await redisClient.del(`comments:post:${comment.post}`);

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});


export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) throw new ApiError(404, "Comment not found");

  if (comment.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
    throw new ApiError(403, "You can only delete your own comments");

  await comment.deleteOne();

  //  Invalidate cache
  await redisClient.del(`comments:post:${comment.post}`);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});


export const toggleLikeComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) throw new ApiError(404, "Comment not found");

  const userId = req.user._id;
  const alreadyLiked = comment.likes.includes(userId);

  if (alreadyLiked) {
    comment.likes.pull(userId);
    await comment.save();
    await redisClient.del(`comments:post:${comment.post}`);
    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment unliked successfully"));
  } else {
    comment.likes.push(userId);
    await comment.save();
    await redisClient.del(`comments:post:${comment.post}`);
    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment liked successfully"));
  }
});


export const replyToComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) throw new ApiError(400, "Reply text is required");

  const parentComment = await Comment.findById(id);
  if (!parentComment) throw new ApiError(404, "Parent comment not found");

  const reply = await Comment.create({
    text,
    user: req.user._id,
    post: parentComment.post,
  });

  parentComment.replies.push(reply._id);
  await parentComment.save();

  await redisClient.del(`comments:post:${parentComment.post}`);

  res
    .status(201)
    .json(new ApiResponse(201, reply, "Reply added successfully"));
});
export const approveComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //  Find the comment by ID
  const comment = await Comment.findById(id);
  if (!comment) throw new ApiError(404, "Comment not found");

  //  Only admin can approve
  if (req.user.role !== "admin")
    throw new ApiError(403, "Only admins can approve comments");

  //  Update approval status
  comment.isApproved = true;
  await comment.save();

  //  Invalidate cache for that post’s comments
  await redisClient.del(`comments:post:${comment.post}`);

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment approved successfully"));
});
export const getAllComments = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "You are not allowed to get all comments");
  }

  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "desc" ? -1 : 1;

  // Fetch comments with pagination and sorting
  const comments = await Comment.find()
    .populate("user", "name email")
    .populate("post", "title")
    .sort({ createdAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalComments = await Comment.countDocuments();

  // Calculate last month’s comments count
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const lastMonthComments = await Comment.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json(
    new ApiResponse(200, 
      { comments, totalComments, lastMonthComments },
      "All comments fetched successfully"
    )
  );
});

