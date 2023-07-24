import express from "express";
import { updatePassword, resetpass, sendOPT, signin, signup, verifyOPT } from "../controllers/userController.js";
import auth from '../middleware/auth.js'
export const userRouter = express.Router()

userRouter.post('/signup', signup)
userRouter.post('/signin', signin)
userRouter.patch('/resetpass/:id', auth, resetpass)
userRouter.post('/sendopt', sendOPT)
userRouter.post('/verifyotp', verifyOPT)
userRouter.post('/updatepass', updatePassword)