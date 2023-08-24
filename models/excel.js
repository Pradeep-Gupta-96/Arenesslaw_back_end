import mongoose from "mongoose";

const excelSchema = new mongoose.Schema({
    filename:String,
    Bank:String,
    NoticeType:String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

const Excel = mongoose.model("Excel", excelSchema);

export default Excel; // Export only the Excel model





