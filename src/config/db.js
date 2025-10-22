import mongoose from "mongoose";
const connectDb=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/blog`)
        console.log('mongodb connected');
        
    } catch (error) {
        console.log('unable to connect database');
        
    }
}
export default connectDb