import express from "express";
const postRouter=express.Router()
import{upload} from '../config/cloudinary.js'
import{protect} from '../utils/generateToken.js'
import{createPost,deletePost,getAllPosts,getPostById, toggleLikePost, updatePost} from '../controllers/post.Controller.js'
postRouter.post('/add', protect,upload.single('coverImage'),createPost)
postRouter.get('/', getAllPosts)
postRouter.get('/:id', getPostById)
postRouter.delete('/:id', protect, deletePost)
postRouter.put('/:id', protect, updatePost)
postRouter.post('/like/:id', protect, toggleLikePost)
export default postRouter