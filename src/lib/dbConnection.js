
import mongoose from "mongoose";


const connectDB = async () => {
    

    try {
        //console.log(dbString)
        // if(mongoose.connection.readyState === "1") { //if db is already connected
        //     // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
            
        //     //console.log("db already connected");
        //     return;
        // }
        const result  = await mongoose.connect(process.env.MONGO_URI);
        return result;
        //console.log("db connected");
        
    } catch (error) {
        //console.log(error);
        process.exit(1);
    }
};


export default connectDB;