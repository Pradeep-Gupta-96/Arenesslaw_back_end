import mongoose from "mongoose"


// Create a Mongoose schema for the xlData subdocument
const xlDataSchema = new mongoose.Schema({
    Notice_ID: String,
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
    NEW_CURR_BAL: Number,
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
    Cur_Bal: Number,
    Notice_Amount_total: Number,
    E_mail: String,
    REF_NO: String,
    NOTICE_DATE: String,
    pdfBuffer: Buffer,
});

// Create a Mongoose schema for the Excel document
const excelSchema = new mongoose.Schema({
    company:String,
    username:String,
    filename: String,
    template: String,
    role: String,
    emailformail: String,
    xlData: [xlDataSchema],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

const Excel = new mongoose.model("Excel", excelSchema)
export default Excel



