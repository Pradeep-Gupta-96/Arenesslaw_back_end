import express from "express";
import { sendEmail, sendSMS } from "../controllers/noticeController.js";
export const noticeRouter=express.Router()


noticeRouter.put('/sendemail/:id',sendEmail)
noticeRouter.get('/sendsms', sendSMS)