import mongoose from "mongoose";

const xlDataSchema = new mongoose.Schema({
    REF_NO: String,
    DATE: Date,
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
    "EMAIL STATUS": String,
    NoticeType: String,
    excelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Excel", // Reference the Excel model
    },
});

const XLData = mongoose.model("XLData", xlDataSchema);

export default XLData 