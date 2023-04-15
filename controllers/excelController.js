import Excel from "../models/excel.js";
import XLSX from 'xlsx'
import fs from 'fs'
import pdf from "html-pdf"


export const postexceldata = async (req, res) => {
    try {
        const { filename, template } = req.body
        const userId = req.userId

        var workbook = XLSX.readFile(req.file.path)
        var sheet_Namelist = workbook.SheetNames;
        var x = 0
        sheet_Namelist.forEach(element => {
            var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_Namelist[x]]);
            //create dynamic pdf of every users 
            var html = fs.readFileSync('./output.html', 'utf8');
            var options = { format: 'Letter' };
            xlData.map((item, index) => {
                console.log(item.FPR_NAME)
                let mapObj = {
                    "{{Amount}}": "130",
                    "{Prise}": "200"
                }

                html = html.replace(/{{Amount}}|{Prise}/gi, (matched) => { return mapObj[matched] })
                pdf.create(html, options).toFile('./email.pdf', async (err, res) => {
                    if (err) {
                        return console.log(err);
                    } else {
                        console.log(res.filename); //  { filename: 'C:\\ARENESS\\createpdf\\invoice.pdf' }
                    }
                });
            })
            // console.log(pd)
            // save data in database
            // console.log(xlData)
            Excel.insertMany({
                filename,
                template,
                xlData,
                userId
            })
            x++;
        })
        return res.json({ status: 200, success: true, msg: 'running' })
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

export const getSingleexceldata = async (req, res) => {
    const id = req.params.id
    try {
        const data = await Excel.findById(id)
        return res.status(200).json({ message: data })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


