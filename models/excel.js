import mongoose from "mongoose"

const excelSchema = new mongoose.Schema({
    filename: {
        type: String,

    },
    template: {
        type: String,

    },
    emailformail: {
        type: String,

    },
    xlData: [{
        "Notice ID": {
            type: String,

        },
        DATE: {
            type: String,

        },
        ACCOUNT: {
            type: Number,

        },
        CARDNO: {
            type: String,

        },
        FPR_NAME: {
            type: String,

        },
        FPR_LD_LIN: {
            type: String,

        },
        FPR_MOB: {
            type: Number,

        },
        EMBONAME: {
            type: String,

        },
        ADDRESS1: {
            type: String,

        },
        ADDRESS2: {
            type: String,

        },
        CITY: {
            type: String,

        },
        STATE: {
            type: String,

        },
        PINCODE: {
            type: Number,

        },
        NEWRISKREGION: {
            type: String,

        },
        "NEW_CURR BAL": {
            type: Number,

        },
        RISKCLASS: {
            type: String,

        },
        BLOCK1: {
            type: String,

        },
        BLOCK2: {
            type: String,

        },
        ZONE: {
            type: String,

        },
        SENDER: {
            type: Number,

        },
        BKT: {
            type: Number,

        },
        MOBILEPHONE_HOME: {
            type: Number,

        },
        TRIGGER: {
            type: String,

        },
        ACTIVITY: {
            type: String,

        },
        STAGE: {
            type: String,

        },
        DPI_Amount: {
            type: Number,

        },
        "Cur Bal": {
            type: Number,

        },
        "Notice Amount(Cur bal+DPI)": {
            type: Number,

        },
        "E-mail": {
            type: String,

        },
        "CASE No": {
            type: String,

        },
        REF_NO: {
            type: String,

        },
        NAME_OF_ARBITRATOR: {
            type: String,

        },
        ADDRESS_OF_ARBITRATOR1: {
            type: String,

        },
        ADDRESS_OF_ARBITRATOR2: {
            type: String,

        },
        CITY: {
            type: String,

        },
        PINCODE_ARB: {
            type: String,

        },
        DATE_ARB: {
            type: String,

        },
        TIME_ARB: {
            type: String,

        },
        MEETING_LINK: {
            type: String,

        },
        MEETING_PASSWORD: {
            type: String,

        },
        MEETING_ID: {
            type: String,

        },
        NOTICE_DATE: {
            type: String,

        },
        NAME_OF_CONCILIATOR: {
            type: String,

        },
        DATE_OF_CONCILIATION: {
            type: String,

        },
        TIMING_OF_CONCILIATION: {
            type: String,

        },
        pdflink: {
            type: String,

        },
    }],
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



