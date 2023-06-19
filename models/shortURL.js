import mongoose from "mongoose";

const URLschema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    redirectURl: {
        type: String,
        required: true
    },
    visitHistory: [
        {
            timestamp: {
                type: Number
            }
        }
    ]

}, {
    timestamps: true
})

const URL = new mongoose.model("url", URLschema)
export default URL