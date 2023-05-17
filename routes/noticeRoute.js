import express from "express";
import { sendEmail } from "../controllers/noticeController.js";
export const noticeRouter=express.Router()


noticeRouter.put('/sendemail/:id',sendEmail)