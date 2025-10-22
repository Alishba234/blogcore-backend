import express from "express";
const commentRouter=express.Router();
import{protect} from '../utils/generateToken.js'
import{ addComment, approveComment, deleteComment, getAllComments, getCommentsByPost, replyToComment, toggleLikeComment, updateComment } from '../controllers/comment.Controller.js'
commentRouter.post('/:postId/add',protect,addComment)
commentRouter.delete('/:id', protect,deleteComment)
commentRouter.put('/:id/update', protect,updateComment)
commentRouter.get('/:postId',getCommentsByPost)
commentRouter.post('/:id/like', protect,toggleLikeComment)
commentRouter.post('/:id/reply', protect,replyToComment)

commentRouter.get('/',protect,getAllComments)
commentRouter.put('/:id/approve', protect,approveComment)
export default commentRouter