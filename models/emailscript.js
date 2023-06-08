import mongoose from "mongoose";

const emailScriptSchema = new mongoose.Schema({
    Subject:String,
    SubjectContent:String,
    CustomerName:String,
    ContentInner:String,
    ContentFooter:String,
    role:String,
    userId:String,
    username:String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: String,
        required: true
    }
})


const Emailscript = new mongoose.model("emailscript", emailScriptSchema)
export default Emailscript