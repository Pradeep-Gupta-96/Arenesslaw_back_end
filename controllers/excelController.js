import Excel from "../models/excel.js";
import XLSX from 'xlsx';
import fs from 'fs';


export const postexceldata = async (req, res) => {
  try {
    const { filename } = req.body
    const userId = req.userId;
    const workbook = XLSX.readFile(req.file.path);
    const sheetNamelist = workbook.SheetNames;


    const processSheetData = async (sheetName) => {
      const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      const updatedXlData = await Promise.all(xlData.map(async (item) => {
        return item;
      }));
      return updatedXlData;
    };

    const updatedXlDataArrays = await Promise.all(sheetNamelist.map(processSheetData));
    const updatedXlData = [].concat(...updatedXlDataArrays);

    await Excel.insertMany({
      filename,
      xlData: updatedXlData,
      userId,
    });

    // Delete the existing file   
    fs.unlinkSync(req.file.path);
    return res.json({ status: 200, success: true, msg: 'running' });
  } catch (error) {
    res.status(500).json({ status: 500, success: false, msg: error.message });
  }
};


// export const postexceldata = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const workbook = XLSX.readFile(req.file.path);
//     const sheetNamelist = workbook.SheetNames;

//     const processSheetData = async (sheetName) => {
//       const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//       return xlData;
//     };

//     const sheetsData = await Promise.all(sheetNamelist.map(processSheetData));

//     // Insert each sheet's data as a separate document in the database
//     for (let i = 0; i < sheetNamelist.length; i++) {
//       await Excel.create({
//         xlData: sheetsData[i],
//         userId,
//       });
//     }

//     // Delete the existing file   
//     fs.unlinkSync(req.file.path);
//     return res.json({ status: 200, success: true, msg: 'running' });
//   } catch (error) {
//     res.status(500).json({ status: 500, success: false, msg: error.message });
//   }
// };



export const getAllexceldata = async (req, res) => {
  try {
    const data = await Excel.find()
    return res.status(200).json({ message: data })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const exponedexcelldata = async (req, res) => {
  try {
    const id = req.params.id
    const data = await Excel.findById(id)
    return res.status(200).json({ message: data })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}




export const DetailsPage = async (req, res) => {
  try {
    const { xlid, singleid } = req.params;
    const data = await Excel.findById(xlid);
    if (!data) {
      return res.status(404).json({ msg: 'Excel data not found' });
    }
    const xlData = data.xlData.id(singleid);
return res.status(200).json({ message:xlData });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

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

