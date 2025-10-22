import express from "express";
const authRouter=express.Router()
import{register,login} from '../controllers/auth.Controller.js'
import { loginValidation, registerValidation } from "../validations/authValidation.js";
import { loginLimiter, signupLimiter } from "../middleware/ratelimiter.js";
import validateRequest from "../middleware/validateRequest.js";
authRouter.post('/register',validateRequest(registerValidation),signupLimiter, register)
authRouter.post('/login',validateRequest(loginValidation),loginLimiter, login)
export default authRouter