import express from 'express'
import dotenv from 'dotenv'
import globalErrorHandler from './utils/globalerrorHandler.js'
import connectDb from './config/db.js';
import authRouter from './routes/auth.Routes.js';
import postRouter from './routes/post.Routes.js';
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import{ connectCloudinary} from './config/cloudinary.js'
import commentRouter from './routes/comment.Routes.js';
dotenv.config()
const app=express();
app.use(express.json())
app.use(helmet());
app.use(xss());
app.use(rateLimit({ windowMs: 10 * 60 * 1000, max: 100 })); // 100 req/10 min
const port=process.env.Port||3000;
app.get('/',(req,res)=>{
    res.send('API is working')
});
app.use('/api/auth',authRouter)
app.use('/api/post',postRouter)
app.use('/api/comment',commentRouter)
connectCloudinary()
connectDb()
app.use(globalErrorHandler)
app.listen(port,()=>{
    console.log(`server is running on port:${port}`);
    
})
