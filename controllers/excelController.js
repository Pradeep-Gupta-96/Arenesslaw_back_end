import Excel from "../models/excel.js";
import XLSX from 'xlsx';
import fs from 'fs';
import User from "../models/users.js"
import bcrypt from 'bcrypt'; // Import bcrypt library


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

     // Iterate through the xlData and create a new user for each item
     for (const item of updatedXlData) {
      try {
        const hashpassword = await bcrypt.hash(item.Account_No || 'User1234', 10); // Hash the password
        const newUser = new User({
          username: item.Name,
          email: item.To ? item.To.toLowerCase() : `User1234@example.com`, // Convert email to lowercase or generate a default email
          role: 'User',
          password: hashpassword, // Set a default password if undefined
          "Mail_Date":item.Mail_Date,
          "To":item.To,
          "Serial_Number":item.Serial_Number,
          "Name":item.Name,
          "Address":item.Address,
          "Description_Client":item.Description_Client,
          "Address_Of_Client":item.Address_Of_Client,
          "Credit_type":item.Credit_type,
          "Account_No":item.Account_No,
          "Cheque_No":item.Cheque_No,
          "Cheque_Date":item.Cheque_Date,
          "Cheque_Amount":item.Cheque_Amount,
          "Cheque_Branch":item.Cheque_Branch,
          "Cheque_Bouncing":item.Cheque_Bouncing,
          "Return_Memo":item.Return_Memo,
          "Our_Bank":item.Our_Bank,
          "Ecs_Date":item.Ecs_Date,
          "Ecs_Bank":item.Ecs_Bank,
          "Ecs_Provider_Name":item.Ecs_Provider_Name,
          "Overdue_Amount":item.Overdue_Amount,
          "Overdue_Date":item.Overdue_Date,
          "Emi_Amount":item.Emi_Amount,
          "SPOC_Name":item.SPOC_Name,
          "SPOC_Number":item.SPOC_Number,
          "SPOC_Email":item.SPOC_Email,
          "Payment_Link_For_Emi":item.Payment_Link_For_Emi,
          "Payment_Link_For_Total_Dues":item.Payment_Link_For_Total_Dues,
          "Date":item.Date,
          "Short_Link":item.Short_Link,
          "Mail_Status":item.Mail_Status,
          "E_mail_Status":item.E_mail_Status,
        });

        await newUser.save();
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }

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

