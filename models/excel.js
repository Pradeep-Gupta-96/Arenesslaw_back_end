import mongoose from "mongoose"


// Create a Mongoose schema for the xlData subdocument
const xlDataSchema = new mongoose.Schema({
    "Notice ID": String,
    DATE: String,
    ACCOUNT: Number,
    CARDNO: String,
    FPR_NAME: String,
    FPR_LD_LIN: String,
    FPR_MOB: Number,
    EMBONAME: String,
    ADDRESS1: String,
    ADDRESS2: String,
    CITY: String,
    STATE: String,
    PINCODE: Number,
    NEWRISKREGION: String,
    "NEW_CURR BAL": Number,
    RISKCLASS: String,
    BLOCK1: String,
    BLOCK2: String,
    ZONE: String,
    SENDER: Number,
    BKT: Number,
    MOBILEPHONE_HOME: Number,
    TRIGGER: String,
    ACTIVITY: String,
    STAGE: String,
    DPI_Amount: Number,
    "Cur Bal": Number,
    "Notice Amount(Cur bal+DPI)": Number,
    "E-mail": String,
    "CASE No": String,
    REF_NO: String,
    NAME_OF_ARBITRATOR: String,
    ADDRESS_OF_ARBITRATOR1: String,
    ADDRESS_OF_ARBITRATOR2: String,
    CITY: String,
    PINCODE_ARB: String,
    DATE_ARB: String,
    TIME_ARB: String,
    MEETING_LINK: String,
    MEETING_PASSWORD: String,
    MEETING_ID: String,
    NOTICE_DATE: String,
    NAME_OF_CONCILIATOR: String,
    DATE_OF_CONCILIATION: String,
    TIMING_OF_CONCILIATION: String,
    pdfBuffer: Buffer,
});

// Create a Mongoose schema for the Excel document
const excelSchema = new mongoose.Schema({
    filename: String,
    template: String,
    emailformail: String,
    xlData: [xlDataSchema],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Excel = new mongoose.model("Excel", excelSchema)

export default Excel



