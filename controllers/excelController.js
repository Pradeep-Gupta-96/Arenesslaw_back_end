import Excel from '../models/excel.js';
import XLSX from 'xlsx';
import fs from 'fs';
import User from "../models/users.js";
import XLData from '../models/sub_excel.js';


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
    const newExcelDocument = await Excel.create({
      filename,
      Bank,
      NoticeType,
      userId,
    });

    // Create an array of XLData subdocuments with reference to Excel document
    const xlDataSubdocs = updatedXlData.map(item => ({
      ...item,
      NoticeType,
      excelId: newExcelDocument._id,
    }));

    // Insert XLData subdocuments in bulk
    await XLData.insertMany(xlDataSubdocs);

    // Delete the existing file
    fs.unlinkSync(req.file.path);

    return res.json({ status: 200, success: true, msg: 'running' });
  } catch (error) {
    console.error('Error while updating and saving newExcelDocument:', error);
    res.status(500).json({ status: 500, success: false, msg: error.message });
  }
};



export const getAllexceldata = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const pageSize = 20; // Default page size is 10

    const totalItems = await Excel.countDocuments();
    const totalPages = Math.ceil(totalItems / pageSize);

    const data = await Excel.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({
      message: data,
      pageInfo: {
        page,
        pageSize,
        totalPages,
        totalItems,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}


export const exponedexcelldata = async (req, res) => {
  try {
    const excelId = req.params.id; // Get the Excel document's _id from the URL parameter
    const page = req.query.page || 1;
    const pageSize = 20; // Fixed page size

    // Calculate the skip value based on the page number and page size
    const skip = (page - 1) * pageSize;

    // Find XLData subdocuments with the specified excelId, skip and limit based on pagination
    const xlDataQuery = XLData.find({ excelId: excelId })
      .skip(skip)
      .limit(pageSize);

    // Get the total data count
    const totalDataCount = await XLData.countDocuments({ excelId: excelId });

    // Calculate the total number of pages based on the total data count and page size
    const totalPages = Math.ceil(totalDataCount / pageSize);

    // Execute the query and get the array of data
    const resultArray = await xlDataQuery.exec();

    // Send the result array in the response
    res.status(200).json({ message: resultArray, totalPages: totalPages })
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const exportExcelData = async (req, res) => {
  try {
    const excelId = req.params.id; // Get the Excel document's _id from the URL parameter
    const FPR_NAME = req.params.query; // Get the username from the URL parameter
    const page = req.query.page || 1;

    const pageSize = 20; // Fixed page size

    // Calculate the skip value based on the page number and page size
    const skip = (page - 1) * pageSize;

    // Build the query to filter XLData based on excelId and username
    const xlDataQuery = XLData.find({ excelId, "FPR_NAME": FPR_NAME })
      .skip(skip)
      .limit(pageSize);

    // Get the total data count for the filtered query
    const totalDataCount = await XLData.countDocuments({ excelId, "FPR_NAME": FPR_NAME });

    // Calculate the total number of pages based on the total data count and page size
    const totalPages = Math.ceil(totalDataCount / pageSize);

    // Execute the query and get the array of data
    const resultArray = await xlDataQuery.exec();

    // Send the result array and total pages in the response
    res.status(200).json({ message: resultArray, totalPages: totalPages });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const detailsPage = async (req, res) => {
  try {
    const { id } = req.params;
    const xlData = await XLData.findById(id);
    if (!xlData) {
      return res.status(404).json({ msg: 'Excel data not found' });
    }
    return res.status(200).json({ message: xlData });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const allNoticesOfOneUser = async (req, res) => {
  try {
    const account = req.params.account;

    // Find XLData documents that match the account
    const xlDataQuery = await XLData.find({ ACCOUNT: account });

    // // Extract the unique excelIds from XLData
    // const uniqueExcelIds = xlDataQuery.map((item) => item.excelId);

    // // Find Excel documents using the unique excelIds
    // const excelDocuments = await Excel.find({ _id: { $in: uniqueExcelIds } });

    //  // Extract the unique excelIds from XLData
    //  const uniqueXLDataIds = excelDocuments.map((item) => item._id);
   
    //    // Find XLData documents using the unique id
    //    const XLDataDocuments = await XLData.find({
    //     excelId: { $in: uniqueXLDataIds },
    //     ACCOUNT: account
    //   });

    return res.status(200).json({ message: xlDataQuery});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// export const getPDF = async (req, res) => {
//   try {
//     const { excelId, xlDataId } = req.params;
//     const excel = await Excel.findById(excelId);
//     if (!excel) {
//       return res.status(404).json({ msg: 'Excel data not found' });
//     }

//     const xlData = excel.xlData.id(xlDataId);
//     if (!xlData) {
//       return res.status(404).json({ msg: 'xlData not found' });
//     }

//     if (!xlData.pdfBuffer) {
//       return res.status(404).json({ msg: 'PDF data not found' });
//     }

//     res.setHeader('Content-Type', 'application/pdf');
//     res.send(xlData.pdfBuffer);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

