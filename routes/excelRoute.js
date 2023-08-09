import express from 'express'
import { postexceldata, getAllexceldata, exponedexcelldata, DetailsPage } from '../controllers/excelController.js'
import multer from 'multer'
import auth from '../middleware/auth.js'

export const excelRoute = express.Router()

// Multer Configuration
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        // Delete the previous file
        if (req.file) {
            fs.unlinkSync('./public/uploads/' + req.file.filename);
        }

        // Generate a new filename
        const newFilename = file.originalname;

        cb(null, newFilename);
    }
});


const upload = multer({ storage });

// Routes
excelRoute.post('/', auth, upload.single('file'), postexceldata)
excelRoute.get('/',auth, getAllexceldata)
excelRoute.get('/:id',auth, exponedexcelldata)
excelRoute.get('/details/:xlid/:singleid',auth,DetailsPage)
