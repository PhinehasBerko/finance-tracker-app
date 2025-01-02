import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connect = async () => {
  try {
    await mongoose.connect(process.env.MongoDB_ConnectionString as string)
        console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed");
  }
};

export default connect;