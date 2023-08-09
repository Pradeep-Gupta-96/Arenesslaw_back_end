import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    role: String,
    password: String,
    Bank: String,
    otp: {
        type: Number,
        default: null
    },
    otpexpiredAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const User = new mongoose.model("User", userSchema)

export default User