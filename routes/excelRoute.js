import express from 'express'
import {
    postexceldata,
    getAllexceldata,
    exponedexcelldata,
    exportExcelData,
    detailsPage,
    allNoticesOfOneUser,
    searchingdata,
    searchingAdmindata,
    getAllexceldatabydate,
    getAllexceldatabyNotice,
    exportinxlsx,
    Chart_data_visualization_admin,
    newdata
} from '../controllers/excelController.js'
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

//  admin Routes

excelRoute.get('/getAllexceldata', auth, getAllexceldata)
excelRoute.get('/getAllexceldatabydate/:inputdate', auth, getAllexceldatabydate)
excelRoute.get('/getAllexceldatabyNotice/:noticetype', auth, getAllexceldatabyNotice)
excelRoute.get('/exponedexcelldata/:id', auth, exponedexcelldata)
excelRoute.get('/Chart_data_visualization_admin/:id', auth, Chart_data_visualization_admin)
excelRoute.get('/searchingAdmindata/:id/:inputvalue', auth, searchingAdmindata)
excelRoute.get('/exportinxlsx/:id', exportinxlsx)

//users Routes
excelRoute.get('/exportExcelData/:id/:query', auth, exportExcelData)
excelRoute.get('/searchingdata/:id/:query/:inputvalue', auth, searchingdata)
excelRoute.get('/detailsPage/:id', auth, detailsPage)
excelRoute.get('/allnoticesofoneusers/:account', auth, allNoticesOfOneUser)

//upload file
excelRoute.post('/', auth, upload.single('file'), postexceldata)

excelRoute.delete('/deleteacc/:excelId',newdata)


