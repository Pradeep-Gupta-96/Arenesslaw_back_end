import mongoose from "mongoose"


// Create a Mongoose schema for the xlData subdocument
const xlDataSchema = new mongoose.Schema({
    REF_NO: String,
    DATE: String,
    ACCOUNT: String,
    CARDNO: String,
    FPR_NAME: String,
    FPR_LD_LIN: String,
    FPR_MOB: String,
    EMBONAME: String,
    ADDRESS1: String,
    ADDRESS2: String,
    CITY: String,
    STATE: String,
    PINCODE: String,
    NNR: String,
    "NEW_CURR BAL": String,
    RISKCLASS: String,
    BLOCK1: String,
    BLOCK2: String,
    "INT FLAG": String,
    ZONE: String,
    SENDER: String,
    BKT: String,
    MOBILEPHONE_HOME: String,
    TREGGER: String,
    ACTIVITY: String,
    STAGE: String,
    "Email Id": String,
    "REQUEST RAISE BY": String,
    Region: String,
    Language: String,
    "Opertaional Status": String,
    "Short Link": String,
    "SMS Status": String,
    "EMAIL STATUS": String

});

// Create a Mongoose schema for the Excel document
const excelSchema = new mongoose.Schema({
    filename:String,
    Bank:String,
    NoticeType:String,
    xlData: [xlDataSchema],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

const Excel = new mongoose.model("Excel", excelSchema)
export default Excel



