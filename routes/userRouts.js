import express from "express";
import { resetpass, signin, signup } from "../controllers/userController.js";
import auth from '../middleware/auth.js'
export const userRouter = express.Router()

userRouter.post('/signup', signup)
userRouter.post('/signin', signin)
userRouter.patch('/resetpass/:id',auth, resetpass)