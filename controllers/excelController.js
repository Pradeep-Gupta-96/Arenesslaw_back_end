import Excel from "../models/excel.js";
import XLSX from 'xlsx';
import fs from 'fs';
import User from "../models/users.js"
import bcrypt from 'bcrypt'; // Import bcrypt library

export const postexceldata = async (req, res) => {
  try {
    const { filename, Bank } = req.body;
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
      const batchPromises = batch.map(async (item) => {
        try {
          const existingUser = await User.findOne({ username: item.SPOC_Email ? item.SPOC_Email.toLowerCase() : `User1234@example.com` });
          if (existingUser) {
            console.log(`User with username ${item.SPOC_Email} already exists. Skipping...`);
            return;
          }
          const hashpassword = await bcrypt.hash("Areness@123", 10);
          const newUser = new User({
            username: item.SPOC_Email,
            email: item.SPOC_Email ? item.SPOC_Email.toLowerCase() : `User1234@example.com`,
            role: 'User',
            password: hashpassword,
            Bank: Bank
          });
          await newUser.save();
        } catch (error) {
          console.error('Error creating user:', error);
        }
      });

      await Promise.all(batchPromises);
    }

    // Insert data into Excel collection
    await Excel.insertMany({
      filename,
      Bank,
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
//     const { filename, Bank } = req.body
//     const userId = req.userId;
//     const workbook = XLSX.readFile(req.file.path);
//     const sheetNamelist = workbook.SheetNames;


//     const processSheetData = async (sheetName) => {
//       const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//       const updatedXlData = await Promise.all(xlData.map(async (item) => {
//         return item;
//       }));
//       return updatedXlData;
//     };

//     const updatedXlDataArrays = await Promise.all(sheetNamelist.map(processSheetData));
//     const updatedXlData = [].concat(...updatedXlDataArrays);

//     // Iterate through the xlData and create a new user for each item
//     for (const item of updatedXlData) {
//       try {
//         const hashpassword = await bcrypt.hash("Areness@123", 10); // Hash the password
//         const newUser = new User({
//           username: item.SPOC_Email,
//           email: item.SPOC_Email ? item.SPOC_Email.toLowerCase() : `User1234@example.com`, // Convert email to lowercase or generate a default email
//           role: 'User',
//           password: hashpassword, // Set a default password if undefined
//           Bank: Bank
//         });
//         await newUser.save();
//       } catch (error) {
//         console.error('Error creating user:', error);
//       }
//     }

//     await Excel.insertMany({
//       filename,
//       Bank,
//       xlData: updatedXlData,
//       userId,
//     });


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

