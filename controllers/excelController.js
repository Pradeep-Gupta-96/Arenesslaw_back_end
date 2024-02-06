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
    const { filename, Bank, NoticeType, ExecutionDate } = req.body;
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
      ExecutionDate,
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
    const page = req.query.page || 1;
    const pageSize = 20; // Default page size is 20

    const totalItems = await Excel.countDocuments();
    const totalPages = Math.ceil(totalItems / pageSize);

    // Add a sort method to order documents by createdAt in descending order
    const data = await Excel.find()
      .sort({ createdAt: -1 }) // assuming 'createdAt' is your timestamp field
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


export const getFilteredExcelData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 20; // Default page size is 20
    const filters = req.query; // Get all query parameters as filters

    // Initialize a query object
    let query = {};

    // Handle ExecutionDate range filtering
    if (filters.startDate && filters.endDate) {
      query.ExecutionDate = {
        $gte: new Date(filters.startDate),
        $lt: new Date(filters.endDate),
      };
    }

    // Filter by createdAt date (assuming input is for a specific day)
    if (filters.createdAt) {
      const startOfDay = new Date(filters.createdAt);
      startOfDay.setHours(0, 0, 0, 0); // Set to start of the day

      const endOfDay = new Date(filters.createdAt);
      endOfDay.setHours(23, 59, 59, 999); // Set to end of the day

      query.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    // Dynamically add other filters
    ['Bank', 'NoticeType'].forEach((field) => {
      if (filters[field]) {
        query[field] = filters[field];
      }
    });

    const totalItems = await Excel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / pageSize);

    const data = await Excel.find(query)
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
    res.status(500).json({ msg: error.message });
  }
};





export const exponedexcelldata = async (req, res) => {
  try {
    const excelId = req.params.id; // Get the Excel document's _id from the URL parameter
    const page = req.query.page || 1;
    let pageSize = (req.query.pageSize) || 20; // Get the page size from the query parameter, default to 20

    // Ensure the page size is within a reasonable range
    pageSize = Math.min(Math.max(pageSize, 1), 100);

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
    res.status(200).json({ message: resultArray, totalPages: totalPages });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



export const Chart_data_visualization_admin = async (req, res) => {
  try {
    const excelId = req.params.id; // Get the Excel document's _id from the URL parameter

    // Find XLData subdocuments with the specified excelId
    const xlData = await XLData.find({ excelId: excelId });

    if (!xlData) {
      return res.status(404).json({ msg: "No data found for the provided ID" });
    }

    // Get the total data count
    const totalDataCount = await XLData.countDocuments({ excelId: excelId });


    // Initialize counters for different statuses
    let deliveredCount = 0;
    let BounceCount = 0;
    let dropCount = 0;
    let naCount = 0;
    let openCount = 0;
    let DeferredCount = 0;

    let smsDeliveredCount = 0;
    let smsUndeliveredCount = 0;
    let smsExpiredCount = 0;
    let smsnaCount = 0;


    // Iterate through xlData to count occurrences
    xlData.forEach((data) => {
      if (data["EMAIL STATUS"] === "Delivered") deliveredCount++;
      if (data["EMAIL STATUS"] === "Bounce") BounceCount++;
      if (data["EMAIL STATUS"] === "Drop") dropCount++;
      if (data["EMAIL STATUS"] === "NA") naCount++;
      if (data["EMAIL STATUS"] === "Open") openCount++;
      if (data["EMAIL STATUS"] === "Deferred") DeferredCount++;

      if (data["SMS Status"] === "Delivered") smsDeliveredCount++;
      if (data["SMS Status"] === "Undelivered") smsUndeliveredCount++;
      if (data["SMS Status"] === "Expired") smsExpiredCount++;
      if (data["SMS Status"] === "NA") smsnaCount++;
    });

    // Create a result object with the counts
    const result = {
      deliveredCount,
      BounceCount,
      dropCount,
      naCount,
      openCount,
      DeferredCount,
      smsDeliveredCount,
      smsUndeliveredCount,
      smsExpiredCount,
      smsnaCount,
      totalDataCount
    };

    // Send the result object in the response
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};




export const searchingAdmindata = async (req, res) => {
  try {
    const excelId = req.params.id; // Get the Excel document's _id from the URL parameter
    const searchvalue = req.params.inputvalue; // Get the inputvalue from the URL parameter
    const page = req.query.page || 1;

    let pageSize = (req.query.pageSize) || 20; // Get the page size from the query parameter, default to 20

    // Ensure the page size is within a reasonable range
    pageSize = Math.min(Math.max(pageSize, 1), 100);

    // Calculate the skip value based on the page number and page size
    const skip = (page - 1) * pageSize;

    // Build the regular expression to match strings starting with searchvalue
    const searchRegex = new RegExp(`^${searchvalue}`, 'i'); // 'i' flag for case-insensitive

    // Build the query to filter XLData based on excelId, FPR_NAME, and starting EMBONAME
    const xlDataQuery = XLData.find({ excelId, "EMBONAME": { $regex: searchRegex } })
      .skip(skip)
      .limit(pageSize);

    // Get the total data count for the filtered query
    const totalDataCount = await XLData.countDocuments({ excelId, "EMBONAME": { $regex: searchRegex } });

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



export const exportinxlsx = async (req, res) => {
  try {
    const excelId = req.params.id; // Get the Excel document's _id from the URL parameter

    // Find XLData subdocuments with the specified excelId
    const xlDataQuery = XLData.find({ excelId: excelId });

    // Execute the query and get the array of data
    const resultArray = await xlDataQuery.exec();

    // Send the result array in the response
    res.status(200).json({ message: resultArray });
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

export const searchingdata = async (req, res) => {
  try {
    const excelId = req.params.id; // Get the Excel document's _id from the URL parameter
    const FPR_NAME = req.params.query; // Get the username from the URL parameter
    const searchvalue = req.params.inputvalue; // Get the inputvalue from the URL parameter
    const page = req.query.page || 1;

    const pageSize = 20; // Fixed page size

    // Calculate the skip value based on the page number and page size
    const skip = (page - 1) * pageSize;

    // Build the regular expression to match strings starting with searchvalue
    const searchRegex = new RegExp(`^${searchvalue}`, 'i'); // 'i' flag for case-insensitive

    // Build the query to filter XLData based on excelId, FPR_NAME, and starting EMBONAME
    const xlDataQuery = XLData.find({ excelId, "FPR_NAME": FPR_NAME, "EMBONAME": { $regex: searchRegex } })
      .skip(skip)
      .limit(pageSize);

    // Get the total data count for the filtered query
    const totalDataCount = await XLData.countDocuments({ excelId, "FPR_NAME": FPR_NAME, "EMBONAME": { $regex: searchRegex } });

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

    return res.status(200).json({ message: xlDataQuery });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const newdata = async (req, res) => {
  try {
    const excelId = req.params.excelId; // assuming the excelId is passed as a URL parameter
console.log(excelId)
    // Find and delete XLData documents that match the excelId
    const deleteResult = await XLData.deleteMany({ excelId: excelId });

    if (deleteResult.deletedCount > 0) {
      return res.status(200).json({ message: `Successfully deleted ${deleteResult.deletedCount} records.` });
    } else {
      return res.status(404).json({ message: "No records found to delete." });
    }
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



export const myCountController = async (req, res) => {
  try {
    const {startDate = '2024-01-01', endDate='2024-01-31', noticeType='Police Complaint'} = req.body
   
    // Aggregate documents in the excels collection based on ExecutionDate and NoticeType
    const aggregationPipeline = [
      {
        $match: {
          ExecutionDate: {
            // $gte: new Date('2024-01-01'),
            // $lte: new Date('2024-01-31')
            $gte: new Date(`${startDate}`),
            $lte: new Date(`${endDate}`)
          },
          NoticeType: `${noticeType}`  
          // NoticeType: 'Demand legal Notice' // 456958 FOR DEC // 449814 FOR JAN
          // NoticeType: 'QLD' // 74771 FOR DEC // 71707 FOR JAN
          // NoticeType: 'E-Conciliation' // 0 FOR DEC // 0 FOR JAN
          // NoticeType: 'Police Complaint' // 0 FOR DEC // 0 FOR JAN
          // NoticeType: 'Execution Notice' // 0 FOR DEC // 0 FOR JAN
          // NoticeType: 'Physical conciliation' // 0 FOR DEC // 0 FOR JAN
        }
      },
      {
        $group: {
          _id: '$ExecutionDate', // Group by ExecutionDate
          excelIds: { $addToSet: '$_id' } // Collect unique excelIds for each group
        }
      }
    ];
 
    const excelDocuments = await Excel.aggregate(aggregationPipeline);
 
    let totalCount = 0;
 
    // For each group of documents, count documents in xldatas collection
    for (const excelGroup of excelDocuments) {
      const excelIds = excelGroup.excelIds;
 
      // Count documents in xldatas collection based on excelIds
      const count = await XLData.countDocuments({
        excelId: { $in: excelIds }
      });
 
      totalCount += count;
    }
 
    // Send total count as a single response
    res.status(200).json({ totalCount: totalCount, noticeType });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

