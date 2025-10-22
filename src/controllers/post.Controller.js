import {Post} from '../models/Post.js'
import { v2 as cloudinary } from "cloudinary";
import asyncHandler from '../middleware/asyncHandler.js'
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js'
import redisClient from '../config/redis.js'
export const createPost=asyncHandler(async (req,res) => {

    const{title,content, category,tags}=req.body;
    if(!title||!content) throw new ApiError(400,"title and content is required")
        if(!req.file) throw new ApiError(404,"coverImage is required")
          
  const result=await cloudinary.uploader.upload(req.file.path)
     const coverImageUrl=result.secure_url
const post=new Post({title,category,content, coverImage:coverImageUrl,tags,author:req.user.id})
    await post.save()
    await redisClient.del("all_posts")
    res.status(201).json(new ApiResponse(201,post,'post created successfully'))
    
})
export const getAllPosts = asyncHandler(async (req, res) => {
  const { search, category, author, tag, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  //  Build MongoDB query
  const query = { isPublished: true };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  if (category) query.category = { $regex: new RegExp(`^${category}$`, "i") };
  if (author) query.author = author;
  if (tag) query.tags = { $in: [tag] }; // if tags are stored as an array

  //  Create a unique cache key based on filters
  const cacheKey = `posts_${search || "all"}_${category || "all"}_${
    tag || "all"
  }_${author || "all"}_page_${page}`;

  //  Check Redis cache
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    console.log("📦 Serving posts from Redis cache");
    return res
      .status(200)
      .json(
        new ApiResponse(200, JSON.parse(cachedData), "Posts fetched from cache")
      );
  }

  console.log(" Serving posts from MongoDB (no cache)");

  //  Fetch posts from MongoDB
  const posts = await Post.find(query)
    .populate("author", "name email")
    .sort({ createdAt: -1 }) // Newest first
    .skip(skip)
    .limit(Number(limit));

  const total = await Post.countDocuments(query);

  const result = {
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    posts,
  };

  //  Cache result for 60 seconds
  await redisClient.setEx(cacheKey, 60, JSON.stringify(result));

  //  Return API response
  res
    .status(200)
    .json(new ApiResponse(200, result, "Posts fetched successfully"));
});

export const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cacheKey = `post_${id}`;
  const cachedPost = await redisClient.get(cacheKey);

  if (cachedPost) {
    console.log(" Serving single post from cache");
    return res
      .status(200)
      .json(new ApiResponse(200, JSON.parse(cachedPost), "Post fetched from cache"));
  }

  const post = await Post.findById(id).populate("author", "name email");

  if (!post) throw new ApiError(404, "Post not found");

  // Cache post for 2 minutes
  await redisClient.setEx(cacheKey, 120, JSON.stringify(post));

  res.status(200).json(new ApiResponse(200, post, "Post fetched successfully"));
});

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found");

  if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
    throw new ApiError(403, "You can only delete your own posts");
  }

  await post.deleteOne();

  // Clear Redis cache
  await redisClient.del(`post_${id}`);
  await redisClient.del("all_posts");

  res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
});
export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found");

  if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
    throw new ApiError(403, "You can only update your own posts");
  }
  if(req.file){
    const result=await cloudinary.uploader.upload(req.file.path)
    updates.coverImage=result.secure_url
  }


  Object.assign(post, updates);
  await post.save();

  // Update cache instead of deleting
  const updatedPost = await Post.findById(id).populate('author');
  await redisClient.setEx(`post_${id}`, 3600, JSON.stringify(updatedPost));

  // Invalidate cache
  await redisClient.del("all_posts");

  res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
});
export const toggleLikePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found");

  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    post.likes.pull(userId);
    await post.save();
    await redisClient.setEx(`post_${id}`, 3600, JSON.stringify(post));
    res.status(200).json(new ApiResponse(200, post, "Post unliked successfully"));
  } else {
    post.likes.push(userId);
    await post.save();
   await redisClient.setEx(`post_${id}`, 3600, JSON.stringify(post));
    res.status(200).json(new ApiResponse(200, post, "Post liked successfully"));
  }
});