import Excel from "../models/excel.js";
import XLSX from 'xlsx';
import fs from 'fs';
import User from "../models/users.js";


// Separate user signup logic
const createUser = async (item) => {
  try {
    const existingUser = await User.findOne({ email: item.FPR_NAME });

      // Remove extra spaces from the username and email
      const cleanedUsername = item.FPR_NAME.trim();
      const cleanedEmail = item.FPR_NAME.trim();
    
    if (!existingUser) {
      const signupData = {
        username: cleanedUsername,
        email: cleanedEmail,
        role: 'User',
        password: 'Areness@123'
      };

      const response = await fetch('http://localhost:4000/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      });

      const responseBody = await response.json();
      // You might want to handle responseBody based on your needs
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: error.message };
  }
};



export const postexceldata = async (req, res) => {
  try {
    const { filename, Bank, NoticeType } = req.body;
    const userId = req.userId;
    const workbook = XLSX.readFile(req.file.path);
    const sheetNamelist = workbook.SheetNames;

    // Define a batch size for bulk insertion
    const batchSize = 100;

    const processSheetData = async (sheetName) => {
      const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      const updatedXlData = await Promise.all(xlData.map(async (item) => {
        return item;
      }));
      return updatedXlData;
    };

    const updatedXlDataArrays = await Promise.all(sheetNamelist.map(processSheetData));
    const updatedXlData = [].concat(...updatedXlDataArrays);

    // Process data in batches
    for (let i = 0; i < updatedXlData.length; i += batchSize) {
      const batch = updatedXlData.slice(i, i + batchSize);

      // Create an array to store promises for signup
      const signupPromises = batch.map(item => createUser(item));

      // Wait for signup promises to complete
      const signupResults = await Promise.all(signupPromises);
    }

    // Insert data into Excel collection
    await Excel.insertMany({
      filename,
      Bank,
      NoticeType,
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
    return res.status(200).json({ message: xlData });
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

