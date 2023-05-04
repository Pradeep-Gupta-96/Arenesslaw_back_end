import Excel from "../models/excel.js";
import XLSX from 'xlsx'
import fs from 'fs'
import pdf from "html-pdf"

export const postexceldata = async (req, res) => {
    try {
        const { filename, template, role } = req.body
        const userId = req.userId
        var workbook = XLSX.readFile(req.file.path)
        var sheet_Namelist = workbook.SheetNames;
        const search = {
            filename: filename
        }
        const findexcelname = await Excel.findOne(search)
        if (!findexcelname) {
            sheet_Namelist.forEach(element => {
                //============== convert to json and save data =====================
                var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_Namelist]);
                Excel.insertMany({
                    filename,
                    template,
                    xlData,
                    userId,
                    role
                })
                var html = fs.readFileSync('./output.html', 'utf8');
                var options = { format: 'Letter' };
                //================ Dynamically chage the data and create pdf ============
                xlData.map((item, index) => {
                    let mapObj = {
                        "[ NAME ]": item.FPR_NAME,
                        "[ ADDRESS ]": item.ADDRESS1,
                        "[ EMAIL ADDRESS ]": item["E-mail"],
                        "[ PHONE ]": item.FPR_MOB,
                        "[ CITY ]": item.CITY,
                        "[ STATE ]": item.STATE
                    }
                    html = html.replace(/[ NAME ]|[ ADDRESS ]|[EMAIL ADDRESS]|[PHONE]|[ CITY ]|[ STATE ]/gi, (matched) => { return mapObj[matched] })

                    pdf.create(html, options).toFile('./email.pdf', async (err, res) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            const value = res.filename
                            setTimeout(inserting, 1000)
                            async function inserting() {
                                await Excel.updateMany({ filename: filename }, { $set: { "xlData.$[].pdflink": value } })
                            }
                        }
                    })
                })
            })
            return res.json({ status: 200, success: true, msg: 'running' })
        } else {
            return res.json({ status: 200, success: true, msg: 'Stop' })
        }
    } catch (error) {
        res.send({ status: 500, success: false, msg: error.message })
    }
}

export const getAllexceldata = async (req, res) => {
    try {
        const data = await Excel.find()
        return res.status(200).json({ message: data })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const getbyuserdata = async (req, res) => {
    try {
        const userId = req.userId
        const currentlogin = await Excel.find({ $and: [{ role: "User" }, { userId: userId }] })
        if (currentlogin) {
            return res.status(200).json({ message: currentlogin })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const getSingleexceldata = async (req, res) => {
    const id = req.params.id
    try {
        const data = await Excel.findById(id)
        return res.status(200).json({ message: data })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}



