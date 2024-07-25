import mongoose from "mongoose";
import { config } from "dotenv";
config();
console.log("uri : ", process.env.MONGO_URI);
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected to : ${connection.connection.port}`);
  } catch (error) {
    console.log("Error during connected to database : ", error);
    process.exit(1);
  }
};
export default connectDB;
