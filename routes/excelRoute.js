import express from 'express'
import { postexceldata, getAllexceldata, getSingleexceldata } from '../controllers/excelController.js'
export const excelRoute = express.Router()
import multer from 'multer'
import auth from '../middleware/auth.js'

//multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

excelRoute.post('/', auth, upload.single('file'), postexceldata)
excelRoute.get('/', getAllexceldata)
excelRoute.get('/:id', getSingleexceldata)

