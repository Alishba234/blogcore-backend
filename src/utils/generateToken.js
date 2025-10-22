import jwt from 'jsonwebtoken'
import{User} from '../models/User.js'
import ApiError from '../utils/apiError.js'
import asyncHandler from '../middleware/asyncHandler.js'
const generateToken=(user)=>{
    const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRY}
    )
    return token
}
 const protect = asyncHandler(async (req, res, next) => {
  let token;

 

if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
  token = req.headers.authorization.replace("Bearer", "").trim();
}
  if (!token) {
   
    throw new ApiError(401, "Not Authorized, token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
   
      throw new ApiError(401, "User not found");
    }

    
    next();
  } catch (error) {
    
    throw new ApiError(401, "Invalid or expired token");
  }
});


export {generateToken,protect}