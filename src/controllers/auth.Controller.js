import {User} from '../models/User.js'
import asyncHandler from '../middleware/asyncHandler.js'
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js'
import { generateToken } from '../utils/generateToken.js';

export const register=asyncHandler(async (req,res) => {
const{name,email,password}=req.body;
const existingEmail=await User.findOne({email})
if(existingEmail) throw new ApiError(400,'User is already exist please choose another')
    
const user=new User({email,password,name})
await user.save()
if(!user) throw new ApiError(400,'Failed to create user')
    const token=generateToken(user)
console.log('generated token',token);

const safeUser={
    id:user._id,
    name:user.name,
    token
}
res.status(201).json(new ApiResponse(201,safeUser,"register succcessfully"))

    
})

export const login=asyncHandler(async (req,res) => {
  const{email,password}=req.body;
  const user=await User.findOne({email}).select("+password")
  if(!user) throw new ApiError(400,'Invalid credentialse')
    const ispasswordValid=await user.comparePassword (password)
if(!ispasswordValid)throw new ApiError(400,'Invalid credentialse')
    const token=generateToken(user)
const safeUser={
    name:user.name,
    email:user.email,
    token
}
res.status(201).json(new ApiResponse(201,safeUser,"login succcessfully"))
})