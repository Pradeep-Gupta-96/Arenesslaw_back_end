import Excel from "../models/excel.js";
import XLSX from 'xlsx';
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
import pdf from 'html-pdf';

const generatePDFBuffer = async (html) => {
  return new Promise((resolve, reject) => {
    pdf.create(html).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};

export const postexceldata = async (req, res) => {
  try {
    const { filename, template, role, username } = req.body;
    const userId = req.userId;
    const workbook = XLSX.readFile(req.file.path);
    const sheetNamelist = workbook.SheetNames;
    const search = { filename };

    const existingExcel = await Excel.findOne(search);
    if (existingExcel) {
      // Delete the existing file
      fs.unlinkSync(req.file.path);
      return res.json({ status: 200, success: true, msg: 'Stop' });
    }


    const processSheetData = async (sheetName) => {
      const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      const updatedXlData = await Promise.all(xlData.map(async (item) => {
        const mapObj = {
          '[Notice_ID]': item.Notice_ID,
          '[DATE]': item.DATE,
          '[ACCOUNT]': item.ACCOUNT,
          '[CARDNO]': item.CARDNO,
          '[FPR_NAME]': item.FPR_NAME,
          '[FPR_LD_LIN]': item.FPR_LD_LIN,
          '[FPR_MOB]': item.FPR_MOB,
          '[EMBONAME]': item.EMBONAME,
          '[ADDRESS1]': item.ADDRESS1,
          '[ADDRESS2]': item.ADDRESS2,
          '[CITY]': item.CITY,
          '[STATE]': item.STATE,
          '[PINCODE]': item.PINCODE,
          '[NEWRISKREGION]': item.NEWRISKREGION,
          '[NEW_CURR_BAL]': item.NEW_CURR_BAL,
          '[RISKCLASS]': item.RISKCLASS,
          '[BLOCK1]': item.BLOCK1,
          '[BLOCK2]': item.BLOCK2,
          '[ZONE]': item.ZONE,
          '[SENDER]': item.SENDER,
          '[BKT]': item.BKT,
          '[MOBILEPHONE_HOME]': item.MOBILEPHONE_HOME,
          '[TRIGGER]': item.TRIGGER,
          '[ACTIVITY]': item.ACTIVITY,
          '[STAGE]': item.STAGE,
          '[DPI_Amount]': item.DPI_Amount,
          '[Cur_Bal]': item.Cur_Bal,
          '[Notice_Amount_total]': item.Notice_Amount_total,
          '[E_mail]': item.E_mail,
          '[REF_NO]': item.REF_NO,
          '[NOTICE_DATE]': item.NOTICE_DATE,
        };

        const templateFilePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'htmltemplates', `${username}.html`);
        let html = fs.readFileSync(templateFilePath, 'utf8');

        Object.keys(mapObj).forEach((key) => {
          const regex = new RegExp('\\' + key, 'gi');
          if (html.includes(key)) {
            html = html.replace(regex, mapObj[key]);
          }
        });
        item.pdfBuffer = await generatePDFBuffer(html);
        return item;
      }));
      return updatedXlData;
    };

    const updatedXlDataArrays = await Promise.all(sheetNamelist.map(processSheetData));
    const updatedXlData = [].concat(...updatedXlDataArrays);

    await Excel.insertMany({
      filename,
      template,
      xlData: updatedXlData,
      userId,
      role,
    });

    // Delete the existing file
    fs.unlinkSync(req.file.path);
    return res.json({ status: 200, success: true, msg: 'running' });
  } catch (error) {
    res.status(500).json({ status: 500, success: false, msg: error.message });
  }
};



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

export const getPDF = async (req, res) => {
  try {
    const { excelId, xlDataId } = req.params;
    const excel = await Excel.findById(excelId);
    if (!excel) {
      return res.status(404).json({ msg: 'Excel data not found' });
    }

    const xlData = excel.xlData.id(xlDataId);
    if (!xlData) {
      return res.status(404).json({ msg: 'xlData not found' });
    }

    if (!xlData.pdfBuffer) {
      return res.status(404).json({ msg: 'PDF data not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.send(xlData.pdfBuffer);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};