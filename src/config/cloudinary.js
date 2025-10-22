import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv'
dotenv.config()
const connectCloudinary=()=>{
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
}



// Use memory storage for multer (file stays in RAM, not saved to disk)
const upload=multer({storage:multer.diskStorage({})})
export default upload
export{upload,connectCloudinary}