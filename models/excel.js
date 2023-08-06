import mongoose from "mongoose"


// Create a Mongoose schema for the xlData subdocument
const xlDataSchema = new mongoose.Schema({
    "Mail_Date": String,
    "To": String,
    "Serial_Number": String,
    "Name": String,
    "Address": String,
    "Description_Client": Number,
    "Address_Of_Client": String,
    "Credit_type": String,
    "Account_No": Number,
    "Cheque_No": String,
    "Cheque_Date": String,
    "Cheque_Amount": String,
    "Cheque_Branch": String,
    "Cheque_Bouncing": String,
    "Return_Memo": String,
    "Our_Bank": String,
    "Ecs_Date": String,
    "Ecs_Bank": String,
    "Ecs_Provider_Name": String,
    "Overdue_Amount": String,
    "Overdue_Date": String,
    "Emi_Amount": String,
    "SPOC_Name": String,
    "SPOC_Number": String,
    "SPOC_Email": String,
    "Payment_Link_For_Emi": String,
    "Payment_Link_For_Total_Dues": String,
    "Date": String,
    "Short_Link": String,
    "Mail_Status": String,
    "E_mail_Status": String

});

// Create a Mongoose schema for the Excel document
const excelSchema = new mongoose.Schema({
    filename:String,
    xlData: [xlDataSchema],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

const Excel = new mongoose.model("Excel", excelSchema)
export default Excel



