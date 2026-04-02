import mongoose from "mongoose";

const dbConnect = async () => {
    try{
        const response = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    }catch(err){
        console.log("Error during db Connect",err)
    }
}

export default dbConnect;