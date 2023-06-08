import express from "express";
import multer from "multer";
import { getemailtempdata, postemailtempdata, getmailtempdataforupdate, updatemailtempdata, getmailtempbyid, viewpdf, delettemp } from "../controllers/emailtempController.js";
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

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB (in bytes)
  }
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size exceeds the limit" });
    }
  }
  next(err);
};

emailtempRoute.post('/', auth, upload.single('Emaillogo'), postemailtempdata)
emailtempRoute.get('/', auth, getemailtempdata)  //html with pdf
emailtempRoute.get('/viewpdf/:id', auth, viewpdf)
emailtempRoute.delete('/deletpdf/:id',auth, delettemp)
emailtempRoute.get('/data', auth, getmailtempdataforupdate)
emailtempRoute.get('/data/:id', auth, getmailtempbyid)
emailtempRoute.put('/:id', auth, upload.single('Emaillogo'), updatemailtempdata)

emailtempRoute.use(handleMulterError);
