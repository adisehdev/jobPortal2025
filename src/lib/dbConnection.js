"use server"
import mongoose from "mongoose";


export const connectDB = async () => {
    const dbString = process.env.MONGO_URI

    try {
        //console.log(dbString)
        // if(mongoose.connection.readyState === "1") { //if db is already connected
        //     // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
            
        //     console.log("db already connected");
        //     return;
        // }
        const result  = await mongoose.connect(dbString);
        return result;
        //console.log("db connected");
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};