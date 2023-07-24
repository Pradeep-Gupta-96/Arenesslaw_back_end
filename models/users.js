import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp:{
        type:Number,
        default:null
    },
    otpexpiredAt:{
        type:Date,
        default:null
    }
}, { timestamps: true })

const User = new mongoose.model("User", userSchema)

export default User