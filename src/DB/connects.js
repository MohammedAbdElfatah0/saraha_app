import mongoose from "mongoose";
export function connectDB() {
    mongoose.connect(process.env.CONNECT_DATABASE,)
        .then(() => console.log("MongoDB connected"))
        .catch(err => console.error("MongoDB connection error:", err));
}