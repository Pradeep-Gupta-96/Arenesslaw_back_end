import mongoose from "mongoose"

const emailtempSchema = new mongoose.Schema({
    imagePath: {
        type: String,

    },
    title: {
        type: String,

    },
    subtitle: {
        type: String,

    },
    noticeid: {
        type: String,

    },
    noticeidEg: {
        type: String,

    },
    noticedate: {
        type: String,

    },
    noticedateEg: {
        type: String,

    },
    to: {
        type: String,

    },
    address: {
        type: String,

    },
    subject: {
        type: String,

    },
    subjecttitle: {
        type: String,

    },
    ContentInner: {
        type: String,

    },
    ContentFooter: {
        type: String,

    },
    username:{
        type:String,
    },
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

const Emailtemp = new mongoose.model("Emailtemp", emailtempSchema)

export default Emailtemp



