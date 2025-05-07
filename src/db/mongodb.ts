import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const connectDb = async () => {
    try{
        if (!process.env.MongoDBUri) {
            throw new Error("MONGO_URI is not defined");
        }

        const connection = await mongoose.connect(process.env.MongoDBUri!)
        console.log("Database connected successfully");
    }catch(error){
        console.log("Error connecting to database", error);
    }
}

export default connectDb;