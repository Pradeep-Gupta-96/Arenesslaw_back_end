import mongoose from "mongoose";

export const database = async () => {
    try {
     const {connection}=   await mongoose.connect(process.env.COLL_DB)
        console.log(`database connected ${connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}