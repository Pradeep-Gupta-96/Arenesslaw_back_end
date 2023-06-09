import express from "express";
import {
    deletescript,
    editemailscriptedata,
    getMailScript,
    getmailscriptdatabyid,
    pdfview,
    postemailscriptedata
} from "../controllers/emailScriptController.js";
import auth from "../middleware/auth.js";

export const emailscriptRoute = express.Router()

emailscriptRoute.post('/script', auth, postemailscriptedata)
emailscriptRoute.get('/getscript', auth, getMailScript)
emailscriptRoute.get('/getscript/:id', auth, getmailscriptdatabyid)
emailscriptRoute.delete('/deletescript/:id', auth, deletescript)
emailscriptRoute.get('/pdfview/:id', auth, pdfview)
emailscriptRoute.put('/script/:id', auth, editemailscriptedata)
