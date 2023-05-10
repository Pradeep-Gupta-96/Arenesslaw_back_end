import express from "express";
import multer from "multer";
import { getemailtempdata, postemailtempdata, getmailtempdataforupdate, updatemailtempdata, getmailtempbyid } from "../controllers/emailtempController.js";
import auth from "../middleware/auth.js";
export const emailtempRoute = express.Router()


//multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './emaillogo/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

emailtempRoute.post('/', auth, upload.single('Emaillogo'), postemailtempdata)
emailtempRoute.get('/', auth, getemailtempdata)
emailtempRoute.get('/data',auth, getmailtempdataforupdate)
emailtempRoute.get('/data/:id',auth, getmailtempbyid)
emailtempRoute.put('/:id',auth, upload.single('Emaillogo'), updatemailtempdata)